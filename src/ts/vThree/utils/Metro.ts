type PlayStatus = 'playing' | 'stopping';

export default class Metro {
    callback_function: () => void;

    next_note_time: number;
    msec_per_beat: number;
    ahead: number;
    status: PlayStatus;

    interval_span;
    number;
    interval_function: number;

    gui_box: HTMLDivElement;
    bpm_meter: HTMLHeadingElement;

    record_button: HTMLButtonElement;
    before_recorded: number;
    clear_recorded_timeout: number;

    constructor(bpm: number, callback: () => void, use_button: boolean) {
        this.generateGuiBox();
        this.generateBPMMeter();
        if (use_button) {
            this.generateRecordButton();
        }

        this.next_note_time = 0;
        this.ahead = 2000;

        this.setBPM(bpm || 120);
        this.setCallbackFunction(callback);

        this.interval_function = null;
        this.interval_span = 25;

        this.status = 'stopping';
    }

    private generateGuiBox() {
        this.gui_box = document.createElement('div');
        this.gui_box.style.position = 'fixed';
        this.gui_box.style.width = '60px';
        this.gui_box.style.zIndex = '1000';
        this.gui_box.style.left = 'auto';
        this.gui_box.style.top = 'auto';
        this.gui_box.style.bottom = '0';
        this.gui_box.style.right = '0';

        document.body.appendChild(this.gui_box);
    }

    private generateBPMMeter() {
        this.bpm_meter = document.createElement('h3');
        this.bpm_meter.style.color = '#aaaaaa';

        this.gui_box.appendChild(this.bpm_meter);
    }

    showMeter() {
        this.bpm_meter.style.display = 'block';
    }

    hideMeter() {
        this.bpm_meter.style.display = 'none';
    }

    private generateRecordButton() {
        this.before_recorded = null;

        this.record_button = document.createElement('button');

        // style
        this.record_button.style.width = '60px';
        this.record_button.style.height = '60px';
        this.record_button.style.zIndex = '1000';

        this.record_button.addEventListener('click', () =>{
            this.record();
        });

        this.gui_box.appendChild(this.record_button);
    }

    showButton() {
        if (!this.record_button) this.generateRecordButton();
        this.record_button.style.display = 'block';
    }

    hideButton() {
        if (!this.record_button) return;
        this.record_button.style.display = 'none';
    }

    record() {
        const current_time = performance.now();

        if (this.before_recorded !== null) {
            this.setMSPB(current_time - this.before_recorded);
        }

        if (this.status === 'stopping') this.resume();

        this.before_recorded = current_time;

        if (this.clear_recorded_timeout) clearTimeout(this.clear_recorded_timeout);

        // @ts-ignore
        this.clear_recorded_timeout = setTimeout(() => {
            this.before_recorded = null;
        }, 2000);
    }

    setCallbackFunction(func: () => void) {
        this.callback_function = func;
    }

    setBPM(bpm) {
        this.setMSPB(60000/bpm);
    }

    setMSPB(mspb) {
        this.msec_per_beat = mspb;

        this.outputBPM();

        this.interval_span = this.msec_per_beat * 0.65;
    }

    outputBPM() {
        console.log(`current_bpm : ${60000 / this.msec_per_beat}`);

        this.bpm_meter.textContent = `${60000 / this.msec_per_beat}`;
    }

    resume() {
        if (this.status === 'playing') this.stop();
        this.status = 'playing';

        this.interval_function = setInterval(() => {
            this.main();
        }, this.interval_span);
    }

    stop() {
        if (this.status === 'playing') {
            clearInterval(this.interval_function);
            this.status = 'stopping';
        }
    }

    private main() {
        if (performance.now() > this.next_note_time + this.ahead) {
            setTimeout(()=> {
               this.bang();
            }, );

            this.next_note_time += this.msec_per_beat;
        }
    }

    private bang() {
        this.callback_function();
    }
}