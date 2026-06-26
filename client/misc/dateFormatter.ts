class DateWrapper {
  private d: Date;

  constructor(val: any) {
    this.d = new Date(val);
  }

  format(fmt: string): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = this.d;
    if (isNaN(d.getTime())) return "-";

    if (fmt === "HH:mm") {
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    if (fmt === "HH:mm:ss") {
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    if (fmt === "DD.MM") {
      return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
    }
    if (fmt === "DD MMM YYYY") {
      const month = d.toLocaleDateString("en-US", { month: "short" });
      return `${pad(d.getDate())} ${month} ${d.getFullYear()}`;
    }
    if (fmt === "MMM") {
      return d.toLocaleDateString("en-US", { month: "short" });
    }
    if (fmt === "DD.MM.YYYY HH:mm:ss") {
      return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ` +
             `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
    if (fmt === "MMM DD HH:mm") {
      const month = d.toLocaleDateString("en-US", { month: "short" });
      return `${month} ${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    if (fmt === "ddd") {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (fmt === "Do") {
      const day = d.getDate();
      const suffix = ["th", "st", "nd", "rd"];
      const v = day % 100;
      const ord = suffix[(v - 20) % 10] || suffix[v] || suffix[0];
      return `${day}${ord}`;
    }
    if (fmt === "HH") {
      return pad(d.getHours());
    }

    return d.toISOString();
  }
}

export default function moment(val: any) {
  return new DateWrapper(val);
}
