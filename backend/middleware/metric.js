const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'HTTP request duration in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 300, 400, 500]
});

 const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const route = req.route?.path || req.path || req.originalUrl || 'unknown';

        httpRequestDurationMicroseconds
            .labels(req.method, route, res.statusCode.toString())
            .observe(duration);
    });

    next();
};

const cronJobExecutionCount = new client.Counter({
    name: 'cron_job_executions_total',
    help: 'Total number of times a cron job has executed',
    labelNames: ['job_name'],
});

const cronJobDuration = new client.Histogram({
    name: 'cron_job_duration_seconds',
    help: 'Time taken for cron jobs to execute',
    labelNames: ['job_name'],
    buckets: [0.1, 0.5, 1, 2, 5, 10] 
});


 const trackCronJob = (jobName, jobFunction) => {
    return async () => {
        cronJobExecutionCount.labels(jobName).inc(); 
        const end = cronJobDuration.labels(jobName).startTimer(); 

        try {
            await jobFunction();
        } finally {
            end(); 
        }
    };
};


module.exports = {
    metricsMiddleware,
    trackCronJob

}