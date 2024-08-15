const axios = require("axios");
const readline = require("readline");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

const init_data =
  "query_id=AAEEkPxFAgAAAASQ_EWVFVgk&user=%7B%22id%22%3A5469147140%2C%22first_name%22%3A%22H%E1%BB%AFu%22%2C%22last_name%22%3A%22Uy%20%F0%9F%A6%B4%22%2C%22username%22%3A%22huuuy1801%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1723684167&hash=1c4aa896bc7cc3f8679039826cff4c3e5605b26ae3b56a24111e4d0fedc00243";

class JetTON {
  headers() {
    return {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
      Authorization: "tma " + init_data,
      "Cache-Control": "max-age=0",
      Referer: "https://t.me/Ton_kombat_bot/app?startapp=5469147140",
      Priority: "u=1, i",
      "Sec-Ch-Ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Linux"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    };
  }

  log(msg) {
    console.log(`[*] ${msg}`);
  }

  async waitWithCountdown(seconds) {
    for (let i = seconds; i >= 0; i--) {
      const hours = Math.floor(i / 3600);
      const minutes = Math.floor((i % 3600) / 60);
      const secs = i % 60;
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(
        `===== Chờ ${hours} giờ ${minutes} phút ${secs} giây để tiếp tục =====`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log("");
  }

  async login() {
    const url = "https://staggering.tonkombat.com/api/v1/users/me";
    const headers = this.headers();

    try {
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi khi login".red}`);
      console.error("error", error);
      return null;
    }
  }

  async getUserData() {
    const url = "https://staggering.tonkombat.com/api/v1/combats/me";
    const headers = this.headers();

    try {
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Query die lấy lại query mới".red}`);
      return null;
    }
  }

  async getEnergy() {
    const url = "https://staggering.tonkombat.com/api/v1/combats/energy";
    const headers = this.headers();

    try {
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi khi kiểm tra năng lượng".red}`);
      // console.error("error", error);
      return null;
    }
  }

  async getBalance() {
    const url = "https://staggering.tonkombat.com/api/v1/users/balance";
    const headers = this.headers();

    try {
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi khi lấy dữ liệu điểm".red}`);
      // console.error("error", error);
      return null;
    }
  }

  async lastClaim() {
    const url = "https://staggering.tonkombat.com/api/v1/users/last_claim";
    const headers = this.headers();

    try {
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi khi lấy dữ liệu lastClaim".red}`);
      console.error("error", error);
      return null;
    }
  }

  async claimGame() {
    const url = "https://staggering.tonkombat.com/api/v1/users/claim";
    const headers = this.headers();
    headers["Accept"] = "*/*";
    headers["Cache-Control"] = "no-cache";
    headers["Origin"] = "https://staggering.tonkombat.com";
    headers["Pragma"] = "no-cache";
    const payload = { init_data };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi khi claim game".red}`);
      await this.waitWithCountdown(540);
      return null;
    }
  }

  async findUser() {
    const url = "https://staggering.tonkombat.com/api/v1/combats/find";
    const headers = this.headers();

    try {
      const response = await axios.get(url, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi không tìm thấy đối thủ".red}`);
      // console.error("error", error);
      return null;
    }
  }

  async fightUser() {
    const url = "https://staggering.tonkombat.com/api/v1/combats/fight";
    const headers = this.headers();
    headers["Accept"] = "*/*";
    headers["Cache-Control"] = "no-cache";
    headers["Origin"] = "https://staggering.tonkombat.com";
    headers["Pragma"] = "no-cache";
    const payload = { init_data };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data.data;
    } catch (error) {
      this.log(`${"Lỗi không đấm được đối thủ".red}`);
      // console.error("error", error);
      return null;
    }
  }

  async main() {
    const login = await this.login();
    const userData = await this.getUserData();
    const balance = await this.getBalance();
    const energy = await this.getEnergy();
    let countFind = energy.current_energy;

    if (login && userData) {
      console.log(
        `========== Login Vào TK | ${login.username.green} | Thành Công ==========`
      );
      this.log(`Balance: ${balance.toString().white}`.green);
    } else {
      this.log(`${"Lỗi: Không tìm thấy dữ liệu người dùng".red}`);
    }

    while (true) {
      // const claimGame = await this.claimGame();

      // if (claimGame) {
      //   console.log(
      //     "Đã claim được:".yellow,
      //     claimGame.amount,
      //     "| Vào lúc: ".green,
      //     dayjs(claimGame.timestamp).format("DD/MM/YYYY HH:mm:ss")
      //   );
      // }

      do {
        if (countFind > 0) {
          const findUser = await this.findUser();
          if (findUser) {
            console.log("Bạn đang 👊 nhau với:".red, findUser.username);
            const fightUser = await this.fightUser();
            console.log(
              `Kết quả: ${
                fightUser.winner === "attacker" ? "WIN".green : "THUA".red
              }`
            );
          }
          countFind -= 1;
        } else {
          const checkEnergy = await this.getEnergy();
          countFind = checkEnergy.current_energy;
          console.log("Số lượt 👊 nhau còn:".red, countFind);
          await this.waitWithCountdown(3600);
        }
      } while (countFind > 0);
    }
  }
}

if (require.main === module) {
  const jetton = new JetTON();
  jetton.main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
