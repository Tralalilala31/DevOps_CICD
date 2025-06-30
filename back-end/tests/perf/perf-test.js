const http = require("http");

const URL = process.env.API_URL || "http://localhost:3000/api/users";

// Fonction pour mesurer le temps de réponse

function testPerf(url, method = "GET", body = null) {

    console.log(`🚀 Test [${method}] sur ${url}`);

    const options = {

        method,

        headers: {

            "Content-Type": "application/json"

        }

    };

    const start = Date.now();

    const req = http.request(url, options, (res) => {

        const duration = Date.now() - start;

        console.log(`✅ ${method} ${url} en ${duration}ms (status ${res.statusCode})`);

    });

    req.on("error", (err) => {

        console.error(`❌ Erreur sur ${method} ${url} :`, err.message);

    });

    if (body) {

        req.write(JSON.stringify(body));

    }

    req.end();

}

// 🔹 1. Test GET tous les utilisateurs

testPerf(URL);

// 🔹 2. Test GET sur un ID (à adapter si besoin)

testPerf(`${URL}/4d828277-8834-44ca-8c07-3d0fb9e13211`);

// 🔹 3. Test POST (ajout)

testPerf(URL, "POST", {

    nom: "Perf",

    prenom: "Test",

    email: "perf@test.com"

});

// 🔹 4. Test PUT (modification)

testPerf(`${URL}/7080001c-52f7-4728-8648-8f56a8cd3c39`, "PUT", {

    nom: "PerfEdit",

    prenom: "Updated",

    email: "edit@test.com"

});

// 🔹 5. Test DELETE (⚠️ optionnel : à commenter si tu veux garder l’entrée)

testPerf(`${URL}/7080001c-52f7-4728-8648-8f56a8cd3c39`, "DELETE");

