const express = require("express");
const { chromium } = require("playwright");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint para verificar se o serviço está online
app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "Shopee Playwright Service"
    });
});

// Endpoint de teste
app.get("/buscar", async (req, res) => {

    const termo = req.query.termo || "creatina";

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    try {

        await page.goto(
            'https://shopee.com.br/search?keyword=${encodeURIComponent(termo)},
            {
                waitUntil: "networkidle"
            }
        );

        const titulo = await page.title();

        await browser.close();

        res.json({
            sucesso: true,
            pesquisa: termo,
            titulo
        });

    } catch (erro) {

        await browser.close();

        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

app.listen(PORT, () => {
    console.log(Servidor rodando na porta ${PORT});
});
