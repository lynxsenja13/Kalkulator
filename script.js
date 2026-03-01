let bahanList = [];
let database = [];

async function loadDatabase() {
  const res = await fetch(API_URL);
  database = await res.json();
}

loadDatabase();

function tambahBahan() {
  const nama = document.getElementById("namaBahan").value;
  const berat = parseFloat(document.getElementById("beratBahan").value);

  if (!nama || !berat) return;

  bahanList.push({ nama, berat });
  renderList();
}

function renderList() {
  const ul = document.getElementById("listBahan");
  ul.innerHTML = "";

  bahanList.forEach(b => {
    ul.innerHTML += `<li>${b.nama} - ${b.berat} g</li>`;
  });
}

const kategoriList = [
  "Balita",
  "Bumil & Busui",
  "SD 1-3",
  "SD 4-6",
  "SMP",
  "SMA"
];

function hitungTotal(list) {
  let total = {
    Energi: 0,
    Protein: 0,
    Lemak: 0,
    Karbohidrat: 0,
    Kalsium: 0,
    Serat: 0
  };

  list.forEach(item => {
    const db = database.find(
      d => d["Nama Bahan"].toLowerCase() === item.nama.toLowerCase()
    );

    if (!db) return;

    Object.keys(total).forEach(k => {
      total[k] += (item.berat / 100) * (db[k] || 0);
    });
  });

  return total;
}

function generateLaporan() {
  const hasilDiv = document.getElementById("hasil");
  hasilDiv.innerHTML = "";

  kategoriList.forEach(kat => {
    const total = hitungTotal(bahanList);

    hasilDiv.innerHTML += `
      <div class="card kategori">
        <h3>${kat}</h3>
        <label><input type="checkbox" onchange="toggleLibur(this)"> Libur</label>
        <p>Energi: ${total.Energi.toFixed(1)}</p>
        <p>Protein: ${total.Protein.toFixed(1)}</p>
        <p>Lemak: ${total.Lemak.toFixed(1)}</p>
        <p>Karbo: ${total.Karbohidrat.toFixed(1)}</p>
        <p>Kalsium: ${total.Kalsium.toFixed(1)}</p>
        <p>Serat: ${total.Serat.toFixed(1)}</p>
      </div>
    `;
  });
}

function toggleLibur(cb) {
  const card = cb.closest(".kategori");
  if (cb.checked) {
    card.querySelectorAll("p").forEach(p => {
      p.innerHTML = p.innerHTML.split(":")[0] + ": 0";
    });
  }
}
