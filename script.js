
/* ==========================================
   1. NAVIGATION MENU
========================================== */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("show");
    });
});

// Menandai menu sesuai section yang sedang dibuka
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
    let current = "home";

    sections.forEach(section => {
        const top = section.offsetTop - 130;

        if (window.scrollY >= top) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + current
        );
    });
});


/* ==========================================
   2. HELPER FUNCTIONS
========================================== */

// Mengambil input dan memastikan bilangan bulat
function getInteger(id) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (value === "") {
        throw new Error("Semua kolom input wajib diisi.");
    }

    if (!/^-?\d+$/.test(value)) {
        throw new Error("Masukkan bilangan bulat yang valid.");
    }

    return BigInt(value);
}

// Menampilkan hasil ke kotak kalkulator
function showResult(id, html, isError = false) {
    const box = document.getElementById(id);

    box.innerHTML = html;
    box.classList.add("show");

    if (isError) {
        box.style.borderLeftColor = "#c05c78";
    } else {
        box.style.borderLeftColor = "#9b7acb";
    }
}

// Menampilkan pesan error
function showError(id, message) {
    showResult(
        id,
        `<span class="error">⚠ ${message}</span>`,
        true
    );
}

// Menghitung modulo matematika
function positiveModulo(a, m) {
    return ((a % m) + m) % m;
}


/* ==========================================
   3. LEVEL 1 - MODULO CALCULATOR
========================================== */

document.getElementById("modButton").addEventListener("click", () => {

    try {
        const a = getInteger("modA");
        const m = getInteger("modM");

        if (m <= 0n) {
            throw new Error("Modulus harus berupa bilangan bulat positif.");
        }

        const remainder = positiveModulo(a, m);

        const quotient = (a - remainder) / m;

        showResult("modResult", `
            <strong>✦ Hasil Perhitungan</strong>
            <hr>

            <strong>${a.toString()} mod ${m.toString()} = ${remainder.toString()}</strong>

            <br><br>

            <strong>Proses Perhitungan:</strong>
            <br>
            a = q × m + r
            <br>
            ${a.toString()} = (${quotient.toString()} × ${m.toString()}) + ${remainder.toString()}

            <br><br>

            Sisa pembagian adalah
            <strong>${remainder.toString()}</strong>.

            <br><br>

            <span class="success">✓ Perhitungan berhasil!</span>
        `);

    } catch (error) {
        showError("modResult", error.message);
    }
});


/* ==========================================
   4. LEVEL 2 - CONGRUENCE CHECKER
========================================== */

document.getElementById("conButton").addEventListener("click", () => {

    try {
        const a = getInteger("conA");
        const b = getInteger("conB");
        const m = getInteger("conM");

        if (m <= 0n) {
            throw new Error("Modulus harus berupa bilangan bulat positif.");
        }

        const difference = a - b;

        const remainderA = positiveModulo(a, m);
        const remainderB = positiveModulo(b, m);

        const isCongruent = difference % m === 0n;

        const status = isCongruent
            ? `<span class="success">✓ KONGRUEN</span>`
            : `<span class="error">✗ TIDAK KONGRUEN</span>`;

        showResult("conResult", `
            <strong>✦ Hasil Pengecekan</strong>
            <hr>

            <strong>
                ${a.toString()} ${isCongruent ? "≡" : "≢"}
                ${b.toString()} (mod ${m.toString()})
            </strong>

            <br><br>

            Status: ${status}

            <br><br>

            <strong>Proses Pengecekan:</strong>

            <br>
            Syarat kongruensi:
            <br>
            m | (a - b)

            <br><br>

            ${m.toString()} | (${a.toString()} - ${b.toString()})

            <br>
            ${m.toString()} | ${difference.toString()}

            <br><br>

            Sisa a mod m = ${remainderA.toString()}
            <br>
            Sisa b mod m = ${remainderB.toString()}

            <br><br>

            ${isCongruent
                ? "Karena selisih a - b habis dibagi m, maka kedua bilangan kongruen."
                : "Karena selisih a - b tidak habis dibagi m, maka kedua bilangan tidak kongruen."
            }
        `);

    } catch (error) {
        showError("conResult", error.message);
    }
});


/* ==========================================
   5. LEVEL 5 - NUMBER SYSTEM CALCULATOR
========================================== */

// Mengubah BigInt ke representasi basis tertentu
function formatBase(number, base) {
    if (number < 0n) {
        return "-" + (-number).toString(base).toUpperCase();
    }

    return number.toString(base).toUpperCase();
}

document.getElementById("numberButton").addEventListener("click", () => {

    try {
        const input = document.getElementById("numberInput").value.trim();

        const base = Number(
            document.getElementById("baseInput").value
        );

        if (input === "") {
            throw new Error("Masukkan bilangan terlebih dahulu.");
        }

        const patterns = {
            2: /^-?[01]+$/,
            8: /^-?[0-7]+$/,
            10: /^-?\d+$/,
            16: /^-?[0-9a-fA-F]+$/
        };

        if (!patterns[base].test(input)) {
            throw new Error(
                `Input tidak valid untuk sistem bilangan basis ${base}.`
            );
        }

        // Parsing berdasarkan basis asal
        const isNegative = input.startsWith("-");
        const digits = isNegative ? input.slice(1) : input;

        let decimalValue = BigInt(parseBaseToDecimal(digits, base));

        if (isNegative) {
            decimalValue = -decimalValue;
        }

        // Konversi ke empat basis
        const binary = formatBase(decimalValue, 2);
        const decimal = formatBase(decimalValue, 10);
        const octal = formatBase(decimalValue, 8);
        const hexadecimal = formatBase(decimalValue, 16);

        showResult("numberResult", `
            <strong>✦ Hasil Konversi Bilangan</strong>
            <hr>

            <strong>Biner (Basis 2)</strong>
            <br>${binary}

            <br><br>

            <strong>Desimal (Basis 10)</strong>
            <br>${decimal}

            <br><br>

            <strong>Oktal (Basis 8)</strong>
            <br>${octal}

            <br><br>

            <strong>Heksadesimal (Basis 16)</strong>
            <br>${hexadecimal}

            <br><br>

            <span class="success">✓ Konversi berhasil!</span>
        `);

    } catch (error) {
        showError("numberResult", error.message);
    }
});

// Konversi digit ke bilangan desimal menggunakan BigInt
function parseBaseToDecimal(value, base) {

    const digits = "0123456789ABCDEF";
    const upper = value.toUpperCase();

    let result = 0n;

    for (const character of upper) {

        const digit = digits.indexOf(character);

        if (digit < 0 || digit >= base) {
            throw new Error("Digit tidak sesuai dengan basis bilangan.");
        }

        result = result * BigInt(base) + BigInt(digit);
    }

    return result;
}


/* ==========================================
   6. LEVEL 6 - COMBINATORICS CALCULATOR
========================================== */

// Menghitung faktorial menggunakan BigInt
function factorial(n) {

    let result = 1n;

    for (let i = 2n; i <= n; i++) {
        result *= i;
    }

    return result;
}

document.getElementById("combButton").addEventListener("click", () => {

    try {
        const n = getInteger("combN");
        const r = getInteger("combR");

        // Validasi nilai n dan r
        if (n < 0n || r < 0n || r > n) {
            throw new Error("Pastikan 0 ≤ r ≤ n.");
        }

        // Membatasi input agar proses tetap ringan
        if (n > 500n) {
            throw new Error("Nilai n maksimal 500.");
        }

        // Perhitungan faktorial
        const factN = factorial(n);
        const factR = factorial(r);
        const factNR = factorial(n - r);

        // Rumus permutasi
        const permutation = factN / factNR;

        // Rumus kombinasi
        const combination = factN / (factR * factNR);

        showResult("combResult", `
            <strong>✦ Hasil Perhitungan Kombinatorika</strong>
            <hr>

            <strong>1. Permutasi P(n,r)</strong>

            <br>
            Rumus:
            <br>
            P(n,r) = n! / (n-r)!

            <br><br>

            P(${n.toString()},${r.toString()}) =
            ${n.toString()}! / (${n.toString()}-${r.toString()})!

            <br>
            = ${factN.toString()} / ${factNR.toString()}

            <br>
            <strong>Hasil Permutasi = ${permutation.toString()}</strong>

            <hr>

            <strong>2. Kombinasi C(n,r)</strong>

            <br>
            Rumus:
            <br>
            C(n,r) = n! / (r!(n-r)!)

            <br><br>

            C(${n.toString()},${r.toString()}) =
            ${n.toString()}! /
            (${r.toString()}! × (${n.toString()}-${r.toString()})!)

            <br>
            = ${factN.toString()} /
            (${factR.toString()} × ${factNR.toString()})

            <br>
            <strong>Hasil Kombinasi = ${combination.toString()}</strong>

            <hr>

            <strong>Kesimpulan:</strong>

            <br>
            Permutasi memperhatikan urutan objek,
            sedangkan kombinasi tidak memperhatikan urutan objek.

            <br><br>

            <span class="success">✓ Perhitungan berhasil!</span>
        `);

    } catch (error) {
        showError("combResult", error.message);
    }
});


/* ==========================================
   7. CONSOLE INFORMATION
========================================== */

console.log("My Personal Portfolio berhasil dijalankan!");
console.log("Matematika Informatika - Bukti Belajar");
console.log("Level 1, 2, 5, dan 6 siap digunakan.");
