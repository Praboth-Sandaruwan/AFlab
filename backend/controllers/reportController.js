const puppeteer = require("puppeteer");
const Transaction = require("../models/Transaction");

const generateMonthlyReport = async (req, res) => {
  try {
    
    const userId = req.user.id;


    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }


    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`),
      },
    });


    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;

    const htmlContent = `
        <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { text-align: center; color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f4f4f4; }
                </style>
            </head>
            <body>
                <h1>Monthly Report - ${month}/${year}</h1>
                <p><strong>Total Income:</strong> $${totalIncome}</p>
                <p><strong>Total Expenses:</strong> $${totalExpenses}</p>
                <p><strong>Net Savings:</strong> $${netSavings}</p>
                
                <h2>Transactions</h2>
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                    ${transactions
                      .map(
                        (t) => `
                    <tr>
                        <td>${new Date(t.date).toLocaleDateString()}</td>
                        <td>${t.type}</td>
                        <td>$${t.amount}</td>
                    </tr>
                    `
                      )
                      .join("")}
                </table>
            </body>
        </html>`;


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();


    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=report_${month}_${year}.pdf`,
    });
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate report." });
  }
};

module.exports = { generateMonthlyReport };
