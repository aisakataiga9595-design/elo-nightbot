const express = require("express");
const fetch = require("node-fetch");

const app = express();

// 🔴 CAMBIA ESTO
const RIOT_API_KEY = "RGAPI-008bfecf-7266-44ae-abad-dd5b50d4eb55";
const PLATFORM = "LA2"; // LAS = LA1 | LAN = LA2
const SUMMONER_NAME = "ºSantiMelodramaº
";

app.get("/elo", async (req, res) => {
  try {
    const summonerRes = await fetch(
      `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(SUMMONER_NAME)}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const summoner = await summonerRes.json();

    const rankedRes = await fetch(
      `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const ranked = await rankedRes.json();
    const soloQ = ranked.find(q => q.queueType === "RANKED_SOLO_5x5");

    if (!soloQ) return res.send("Unranked en SoloQ");

    res.send(
      `Elo actual: ${soloQ.tier} ${soloQ.rank} – ${soloQ.leaguePoints} LP`
    );
  } catch {
    res.send("Error consultando Riot API");
  }
});

app.listen(3000, () => console.log("OK"));
