import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

const motsFrancais: string[] = [
    "maison",
    "chien",
    "chat",
    "voiture",
    "école",
    "livre",
    "fleur",
    "arbre",
    "soleil",
    "mer",
    "montagne",
    "ami",
    "famille",
    "travail",
    "voyage",
    "restaurant",
    "musique",
    "film",
    "photo",
    "téléphone",
    "ordinateur",
    "internet",
    "eau",
    "feu",
    "air",
    "terre",
    "heure",
    "jour",
    "nuit",
    "semaine",
    "mois",
    "année",
    "rire",
    "pleurer",
    "manger",
    "boire",
    "dormir",
    "courir",
    "marcher",
    "nager",
    "voler",
    "sauter",
    "jouer",
    "écouter",
    "regarder",
    "lire",
    "écrire",
    "parler",
    "penser",
    "aimer",
    "détester",
    "heureux",
    "triste",
    "en colère",
    "fatigué",
    "fort",
    "faible",
    "grand",
    "petit",
    "chaud",
    "froid",
    "rapide",
    "lent",
    "beau",
    "laid",
    "neuf",
    "vieux",
    "bon",
    "mauvais",
    "facile",
    "difficile",
    "vrai",
    "faux",
    "libre",
    "occupé",
    "calme",
    "bruyant",
    "propre",
    "sale",
    "simple",
    "complexe",
    "proche",
    "loin",
    "fort",
    "faible",
    "clair",
    "sombre",
    "doux",
    "dur",
    "gentil",
    "méchant",
    "jeune",
    "vieux",
    "sain",
    "malade",
    "ouvert",
    "fermé",
    "heureux",
    "triste",
    "riche",
    "pauvre",
    "sûr",
    "dangereux",
    "facile",
    "difficile",
    "public",
    "privé",
    "intérieur",
    "extérieur",
    "haut",
    "bas",
    "fort",
    "faible",
    "plein",
    "vide",
    "lent",
    "rapide",
    "fort",
    "faible",
    "propre",
    "sale",
    "léger",
    "lourd",
    "sec",
    "mouillé",
    "chaud",
    "froid",
    "épais",
    "mince",
    "ouvert",
    "fermé",
    "doux",
    "dur",
    "simple",
    "complexe",
    "court",
    "long",
    "étroit",
    "large",
    "droit",
    "tordu",
    "proche",
    "loin",
    "en haut",
    "en bas",
    "devant",
    "derrière",
    "dedans",
    "dehors",
    "ensemble"
  ];
 // Ajoutez tous les mots nécessaires ici

// Fonction pour générer un mot aléatoire à partir de la liste
function genererMotFrancaisAleatoire(): string {
  const motAleatoire = motsFrancais[Math.floor(Math.random() * motsFrancais.length)];
  return motAleatoire.trim(); // Retirez les espaces inutiles
}


// Utilisez la fonction pour générer un mot français aléatoire
let motFrancaisAleatoire = genererMotFrancaisAleatoire();



// Affichez le mot généré
console.log(motFrancaisAleatoire);


async function handler(_req: Request): Promise<Response> {
  try {
    const wordToFind = motFrancaisAleatoire;
    const guess = await extractGuess(_req);
    const similarityResult = await similarity(guess, wordToFind);
    console.log(
      `Tried with word ${guess}, similarity is ${similarityResult}, word to find is ${wordToFind}`
    );
    return new Response(responseBuilder(guess, similarityResult));
  } catch (e) {
    console.error(e);
    return new Response("An error occured : ", e);
  }
}

const extractGuess = async (req: Request) => {
  const slackPayload = await req.formData();
  const guess = await slackPayload.get("text")?.toString();
  if (!guess) {
    throw Error("Guess is empty or null");
  }
  return guess;
};

const responseBuilder = (word: string, similarity: Number) => {
  if (similarity == 1) {
    motFrancaisAleatoire = genererMotFrancaisAleatoire()
    return `Well played ! The word was ${word}.`;
  } else if (similarity > 0.5) {
    return `${word} is very close to the word, score : ${similarity}`;
  } else if (similarity < 0.5) {
    return `${word} is quite far to the word, score : ${similarity}`;
  }
};

const similarity = async (word1, word2) => {
  const body = {
    sim1: word1,
    sim2: word2,
    lang: "fr",
    type: "General Word2Vec",
  };
  console.log("body", body);
  const similarityResponse = await fetch(
    "http://nlp.polytechnique.fr/similarityscore",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  console.log("similarityResponse", similarityResponse);
  const similarityResponseJson = await similarityResponse.json();
  console.log("similarityValue", similarityResponseJson);
  return Number(similarityResponseJson.simscore);
};

serve(handler);