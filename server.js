const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const SUMMONER_NAME = process.env.SUMMONER_NAME;
const TAG_LINE = process.env.TAG_LINE;
const REGION = process.env.REGION;

app.get("/elo", async (req, res) => {
  try {
    const accountUrl = `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      SUMMONER_NAME
    )}/${encodeURIComponent(TAG_LINE)}?api_key=${RIOT_API_KEY}`;

    const accountRes = await axios.get(accountUrl);
    const puuid = accountRes.data.puuid;

    const summonerUrl = `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`;
    const summonerRes = await axios.get(summonerUrl);
    const summonerId = summonerRes.data.id;

    const rankedUrl = `https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RIOT_API_KEY}`;
    const rankedRes = await axios.get(rankedUrl);

    const soloQ = rankedRes.data.find(
      (q) => q.queueType === "RANKED_SOLO_5x5"
    );

    if (!soloQ) {
      return res.send("Sin ranked SoloQ aún");
    }

    res.send(
      `${soloQ.tier} ${soloQ.rank} – ${soloQ.leaguePoints} LP`
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error obteniendo el elo");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
