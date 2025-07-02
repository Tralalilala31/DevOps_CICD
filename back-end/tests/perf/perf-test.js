import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';

const { PORT } = process.env;

if (!PORT) {
    throw new Error("La variable d'environnement PORT n'est pas définie.");
}

const URL = `http://localhost:${PORT}/api/users`;

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

// Tests unitaires de performance
testPerf(URL);
testPerf(`${URL}/4d828277-8834-44ca-8c07-3d0fb9e13211`);
testPerf(URL, "POST", {
    nom: "Perf",
    prenom: "Test",
    email: "perf@test.com"
});
testPerf(`${URL}/7080001c-52f7-4728-8648-8f56a8cd3c39`, "PUT", {
    nom: "PerfEdit",
    prenom: "Updated",
    email: "edit@test.com"
});
testPerf(`${URL}/7080001c-52f7-4728-8648-8f56a8cd3c39`, "DELETE");

// Génération en masse
const baseUrl = URL;
const total = 100;

const generateRandomMember = () => ({
    nom: 'Nom_' + uuidv4().slice(0, 6),
    prenom: 'Prenom_' + uuidv4().slice(0, 6),
    email: 'user_' + uuidv4().slice(0, 6) + '@test.com'
});

const addMembers = async () => {
    const start = Date.now();

    for (let i = 0; i < total; i++) {
        try {
            await axios.post(baseUrl, generateRandomMember());
            console.log(`✅ [${i + 1}] Ajouté`);
        } catch (err) {
            console.error(`❌ [${i + 1}] Échec :`, err.response?.data || err.message);
        }
    }

    const end = Date.now();
    console.log(`⏱️ Temps total pour ${total} ajouts : ${(end - start) / 1000}s`);
};

// Lance l'import massif après 5 secondes (laisser le temps au serveur de monter)
setTimeout(() => {
    addMembers();
}, 5000);
