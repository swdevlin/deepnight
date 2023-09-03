export class DeepnightRevelation extends Application {
  constructor(src, options = {}) {
    super(src, options);
    this.year = 1105;
    this.day = 17;
    this.watch = 1;
    this.daysOnMission = 0;
    /** @type {Event} */
    this.eventListener;
  }

  logTime() {
    console.log(this.year, this.day, this.watch, this.daysOnMission);
  }

  jump() {
    for (let i=0; i<7; i++)
      this.incDay();
  }

  incDay() {
    if (this.day === 365) {
      this.day = 1;
      this.year++;
    } else
      this.day++;
    this.daysOnMission++;
    this.logTime();
  }

  incWatch() {
    if (this.watch === 3) {
      this.watch = 1;
      this.incDay();
    } else
      this.watch++;
    this.logTime();
  }
}
