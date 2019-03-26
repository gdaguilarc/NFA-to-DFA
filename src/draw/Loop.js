class Loop {
    constructor(node, name, ang = -HALF_PI) {
        this.n = node;
        this.ang = ang;
        this.selected = false;

        this.r = 27;
        this.c = {
            x: cos(ang)*this.r*1.75 + node.x,
            y: sin(ang)*this.r*1.75 + node.y
        }

        this.arc = this.calcArc();

        if (this.name == 'lambda') {
            this.nameString = "λ";
        } else {
            this.name = name;
            this.nameString = "" 
            for (let i = 0; i < this.name.length- 1; i++) {
                this.nameString += this.name[i] + ",";
            }
            this.nameString += this.name[this.name.length-1];
        }
    }

    update() {
        this.c = {
            x: cos(this.ang)*this.r*1.75 + this.n.x,
            y: sin(this.ang)*this.r*1.75 + this.n.y
        }
        this.arc = this.calcArc();
    }

    show() {
        if (this.selected) {
            stroke(0, 0, 255);
            fill(0, 0, 255);
        } else {
            stroke(0);
            fill(0);
        }

        let mid = this.midArc();
        textSize(20);
        strokeWeight(1);
        text(this.nameString, mid.x, mid.y)

        noFill();
        strokeWeight(2);
        arc(this.arc.c.x, this.arc.c.y, this.arc.r*2, this.arc.r*2, this.arc.startAng, this.arc.endAng);

        let arrowLine = this.calcLineEquation(this.arc.arrow, this.n);
        push();
        translate(this.arc.arrow.x, this.arc.arrow.y);
        rotate(atan(arrowLine.m));
        if (this.arc.arrow.x <= this.n.x) {
            line(0,0,-10,10);
            line(0,0,-10,-10);
        } else {
            line(0,0,10,10);
            line(0,0,10,-10);
        }     
        pop();
    }

    calcArc() {
        let points = this.calcIntersectNodeCirc(this.n, this.c, this.r);
        let a = points.a;
        let b = points.b;
 
        let aTOc = this.calcLineEquation(a, this.c);
        let bTOc = this.calcLineEquation(b, this.c);

        let startAng, endAng;
        if (dist(a.x-this.c.x, a.y-this.c.y, cos(atan(aTOc.m))*this.r, sin(atan(aTOc.m))*this.r) < 1) {
            startAng = atan(aTOc.m);
        } else {
            startAng = atan(aTOc.m) + PI;
        }
        if (dist(b.x-this.c.x, b.y-this.c.y, cos(atan(bTOc.m))*this.r, sin(atan(bTOc.m))*this.r) < 1) {
            endAng = atan(bTOc.m);
        } else {
            endAng = atan(bTOc.m) + PI;
        }

        let arrow = {
            x: b.x,
            y: b.y,
        }

        let aTOb = this.calcLineEquation(a, b);
        let cRelativeToAB = this.c.y > aTOb.m*this.c.x + aTOb.b ? -1 : 1;
        if (aTOb.m * cRelativeToAB > 0) {
            if (b.y < a.y) {
                [startAng, endAng] = [endAng, startAng];
            }
        } else {
            if (b.y > a.y) {
                [startAng, endAng] = [endAng, startAng];
            }
        }

        return {
            c: this.c,
            r: this.r,
            intersect: {
                i: a,
                f: b
            }, 
            startAng,
            endAng,
            arrow
        }
    }

    midArc() {
        let x = cos((this.arc.startAng+this.arc.endAng)/2)*this.arc.r*1.5 + this.arc.c.x;
        let y = sin((this.arc.startAng+this.arc.endAng)/2)*this.arc.r*1.5 + this.arc.c.y;

        let aTOb = this.calcLineEquation(this.arc.intersect.i, this.arc.intersect.f);
        let cRelativeToAB = this.c.y >= aTOb.m*this.c.x + aTOb.b? -1 : 1;
        let midRelativeToAB = y >= aTOb.m*x + aTOb.b ? -1 : 1;
        if (cRelativeToAB*midRelativeToAB > 0) {
            return {
                x: x,
                y: y
            };
        } else {
            return {
                x: cos((this.arc.startAng+this.arc.endAng)/2 + PI)*this.arc.r*1.5 + this.arc.c.x,
                y: sin((this.arc.startAng+this.arc.endAng)/2 + PI)*this.arc.r*1.5 + this.arc.c.y
            }
        }

    }

    calcLineEquation(pointA, pointB) {
        let m = (pointB.y-pointA.y)/(pointB.x-pointA.x);
        let b = (-m*pointA.x)+pointA.y;

        return {m: m, b: b};
    }

    calcIntersectNodeCirc(node, center, radius) {
        let p0 =  {
            x: node.x,
            y: node.y
        }
        let p1 =  {
            x: center.x,
            y: center.y
        }
        let r0 = node.r;
        let r1 = radius;

        let d = dist(p0.x, p0.y, p1.x, p1.y);
        let a = (r0**2 - r1**2 + d**2) / (2*d);
        let h = sqrt(r0**2 - a**2);

        let p2 = {
            x: p0.x + a*(p1.x-p0.x)/d,
            y: p0.y + a*(p1.y-p0.y)/d
        }

        let p31 = {
            x: p2.x + h*(p1.y-p0.y)/d,
            y: p2.y - h*(p1.x-p0.x)/d
        };
        let p32 = {
            x: p2.x - h*(p1.y-p0.y)/d,
            y: p2.y + h*(p1.x-p0.x)/d
        };

        return {
            a: {
                x: p31.x,
                y: p31.y
            },
            b: {
                x: p32.x,
                y: p32.y
            }
        }
    }
}