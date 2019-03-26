class Node {
    constructor(name, final = false, error = false) {
        this.r = 40;
        this.x = random(0 + this.r, windowWidth - this.r);
        this.y = random(0 + this.r, windowHeight - this.r);
        this.name = name;
        this.selected = false;
        this.final = final;
        this.error = error;
    }

    show() {
        if (this.error) {
            stroke(255, 0, 0);
            fill(255, 0, 0);
        } else if (this.selected) {
            stroke(0, 0, 255);
            fill(0, 0, 255);
        } else {
            stroke(0);
            fill(0);
        }
        textSize(30);
        strokeWeight(1.5);
        textAlign(CENTER);
        text(this.name, this.x, this.y+10)

        noFill();
        strokeWeight(3);
        ellipse(this.x, this.y, this.r*2);
        if (this.final) {
            ellipse(this.x, this.y, this.r*2-15);
        }

    }
}