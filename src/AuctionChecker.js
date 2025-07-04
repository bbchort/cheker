import React, { useState } from "react";

function AuctionChecker() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuction = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "spotDeployState",
          coin: token.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (data?.gasAuction) {
        const { startTimeSeconds, durationSeconds, startGas, endGas } = data.gasAuction;

        const date = new Date(startTimeSeconds * 1000);
        const endDate = new Date((startTimeSeconds + durationSeconds) * 1000);

        setResult({
          date: date.toLocaleString(),
          endDate: endDate.toLocaleString(),
          startGas,
          endGas: endGas || "ещё не завершился",
        });
      } else {
        setResult({ error: "Аукцион не найден или токен не поддерживается." });
      }
    } catch (error) {
      setResult({ error: "Ошибка при получении данных." });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto", background: "#fff", borderRadius: 12 }}>
      <h2>🔍 Проверка цены аукциона Hyperliquid</h2>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Введите тикер (например, SOLV)"
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          width: "100%",
          marginBottom: "1rem",
        }}
      />
      <button
        onClick={checkAuction}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Загрузка..." : "Проверить"}
      </button>

      {result && (
        <div style={{ marginTop: "1rem", fontSize: "1rem" }}>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p>📅 Дата начала аукциона: {result.date}</p>
              <p>⏳ Дата окончания: {result.endDate}</p>
              <p>💰 Стартовая цена газа: {result.startGas}</p>
              <p>🧾 Финальная цена газа: {result.endGas}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AuctionChecker;
