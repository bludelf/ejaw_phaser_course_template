import { WIDTH, CENTER_X } from "scripts/util/globals";
import { Popup } from "./Example2/CustomPopup";


export default class Example2 extends Phaser.Scene {
    constructor() {
        super({ key: "Example2" });
    }

    public create(){
        //++++++++++++++++++++++++++++++++++++++++++++++++
        // const line_x = new Phaser.Geom.Line(200, 0, 900, 0);
        // const line_y = new Phaser.Geom.Line(200, 0, 0, 900);

        // const line_x_p = line_x.getPoints(5);
        // const line_y_p = line_y.getPoints(5);

        // // new Array(12).fill("").forEach((element, index) => {
        // //     this.add.image(CENTER_X, 100+(index*100), "tiles", index);
        // // });
        // var count_img = 0;
        // for (let i=0; i < 4; i++){
        //     for (let j=0; j<4; j++){
        //         this.add.image(line_x_p[i].x, line_y_p[j].y, "tiles", count_img);
        //         count_img++;
        //     }
        // }

        // var coords = new Array(12).fill({x:0, y:0, width: 100, height: 100, originX: 0.5, originY: 0.5});
        // Phaser.Actions.GridAlign(coords, {
        //     cellWidth: 100,
        //     cellHeight: 100,
        //     x: 0,
        //     y: 0
        // });

        // coords.forEach((data, index) => {
        //     console.log(data)
        //     this.add.image(data.x, data.y, "tiles", index);
        // })
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++
        

        //Success
        // var count = 0;
        // for (let i=0; i < 3; i++){
        //     for (let j=0; j<4; j++){
        //         this.add.image(100+(200*j), 300+(200*i), "tiles", count);
        //         count++;
        //         console.log(count);
        //     }
        // }
        //Success
        // for (let i=0; i < 4; i++){
        //     for (let j=0; j<4; j++){
        //         this.add.image(100+(200*j), 300+(200*i), "ui-emptytile");
        //     }
        // }

        

    }




}
