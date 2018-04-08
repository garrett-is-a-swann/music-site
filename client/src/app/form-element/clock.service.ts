import { Injectable } from '@angular/core';

@Injectable()
export class ClockService {

    clock: any;
    func: any;

    constructor() { }

    init(lambda) {
        this.func = lambda;
    }

    stop() {
        if(this.clock != null) {
            clearTimeout(this.clock)
        }
    }
    restart() {
        this.stop()
        this.clock = setTimeout(()=>{
            this.func()}, 1000)
    }
}


