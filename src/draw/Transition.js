class Transition {
    constructor(initial, final, name, pointQ = null) {
        this.i = initial;
        this.f = final
        this.q = pointQ;
        this.type = this.q ? "arc" : "line";
        this.selected = false;

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
        
        this.IFline = this.calcLineEquation(this.i, this.f);
        if (this.type == "line") { 
            this.IFsegment = this.calcLineSegment();
        } else {
            this.IQline = this.calcLineEquation(this.i, this.q);
            this.IQFarc = this.calcArc(); 
        }
    }

    update() {
        this.IFline = this.calcLineEquation(this.i, this.f);
        if (this.q) {
            this.type = 'arc';
        } else {
            this.type = 'line';
        }

        if (this.type == "line") { 
            this.IFsegment = this.calcLineSegment();
        } else {
            this.IQline = this.calcLineEquation(this.i, this.q);
            this.IQFarc = this.calcArc(); 
        }
    }

    show() {
        if (this.type == 'line') {
            if (this.selected) {
                stroke(0, 0, 255);
                fill(0, 0, 255);
            } else {
                stroke(0);
                fill(0);

            }

            textSize(20);
            strokeWeight(1);
            if (this.IFline.m < 1) {
                text(this.nameString, (this.IFsegment.xi + this.IFsegment.xf)/2, (this.IFsegment.yi + this.IFsegment.yf)/2 - 25)
            } else {
                text(this.nameString, (this.IFsegment.xi + this.IFsegment.xf)/2 + 25, (this.IFsegment.yi + this.IFsegment.yf)/2)
            }

            strokeWeight(2);
            line(this.IFsegment.xi, this.IFsegment.yi, this.IFsegment.xf, this.IFsegment.yf);
            push();
            translate(this.IFsegment.xf, this.IFsegment.yf);
            rotate(atan(this.IFline.m));
            if (this.IFsegment.xi <= this.IFsegment.xf) {
                line(0,0,-15,10);
                line(0,0,-15,-10);
            } else {
                line(0,0,15,10);
                line(0,0,15,-10);
            }    
            pop();         

        } else {
            noFill();
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
            if (this.IFline.m < 1) {
                text(this.nameString, mid.x, mid.y - 25);
            } else {
                text(this.nameString, mid.x + 25, mid.y);
            }

            noFill();
            strokeWeight(2);
            arc(this.IQFarc.c.x, this.IQFarc.c.y, this.IQFarc.r*2, this.IQFarc.r*2, this.IQFarc.startAng, this.IQFarc.endAng);

            let intersectLine = this.calcLineEquation(this.IQFarc.arrow, this.f);
            push();
            translate(this.IQFarc.arrow.x, this.IQFarc.arrow.y);
            rotate(atan(intersectLine.m));
            if (this.IQFarc.arrow.x <= this.f.x) {
                line(0,0,-15,10);
                line(0,0,-15,-10);
            } else {
                line(0,0,15,10);
                line(0,0,15,-10);
            }     
            pop();
        }
        
    }

    calcLineSegment() {
        let ini = this.calcIntersectNodeLine(this.i, this.f);
        let fin = this.calcIntersectNodeLine(this.f, this.i);

        return {
            xi: ini.x,
            yi: ini.y,
            xf: fin.x,
            yf: fin.y,
        }
    }

    calcArc() {
        let midIF = {
            x: (this.f.x + this.i.x) / 2,
            y: (this.f.y + this.i.y) / 2
        }
        let midIQ = {
            x: (this.q.x + this.i.x) / 2,
            y: (this.q.y + this.i.y) / 2
        }

        let pIFline = this.calcPerpendicularLineAt(this.IFline, midIF);
        let pIQline = this.calcPerpendicularLineAt(this.IQline, midIQ);

        if (pIQline.m == Infinity || pIQline.m == -Infinity) {
            this.IQline.m += 0.001;
            pIQline = this.calcPerpendicularLineAt({m: this.IQline.m, b: this.IQline.b}, midIQ);
        }

        let cX = (pIQline.b-pIFline.b) / (pIFline.m-pIQline.m);
        let c = {
            x: cX,
            y: (pIFline.m*cX) + pIFline.b
        }

        let r = dist(this.i.x, this.i.y, c.x, c.y);

        let ini = this.calcIntersectNodeCirc(this.i, c, r);
        let fin = this.calcIntersectNodeCirc(this.f, c, r);

        let iniCentro = this.calcLineEquation(ini, c);
        let finCentro = this.calcLineEquation(fin, c);

        let startAng, endAng;
        if (dist(ini.x-c.x, ini.y-c.y, cos(atan(iniCentro.m))*r, sin(atan(iniCentro.m))*r) < 1) {
            startAng = atan(iniCentro.m);
        } else {
            startAng = atan(iniCentro.m) + PI;
        }
        if (dist(fin.x-c.x, fin.y-c.y, cos(atan(finCentro.m))*r, sin(atan(finCentro.m))*r) < 1) {
            endAng = atan(finCentro.m);
        } else {
            endAng = atan(finCentro.m) + PI;
        }

        let arrow = {
            x: fin.x,
            y: fin.y,
        }

        let iniFin = this.calcLineEquation(ini, fin);
        let qRelativeToIniFini = this.q.y > iniFin.m*this.q.x + iniFin.b ? -1 : 1;
        if (iniFin.m * qRelativeToIniFini > 0) {
            if (fin.y < ini.y) {
                [startAng, endAng] = [endAng, startAng];
            }
        } else {
            if (fin.y > ini.y) {
                [startAng, endAng] = [endAng, startAng];
            }
        }

        return {
            c: c,
            r: r,
            intersect: {
                i: ini,
                f: fin
            }, 
            startAng,
            endAng,
            arrow
        }
    }

    calcLineEquation(pointA, pointB) {
        let m = (pointB.y-pointA.y)/(pointB.x-pointA.x);
        let b = (-m*pointA.x)+pointA.y;

        return {m: m, b: b};
    }

    calcPerpendicularLineAt(line, point) {
        let m = -1/line.m;
        let b = (-m*point.x) + point.y;
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

        if ((this.IFline.m*this.q.x + this.IFline.b - this.q.y)*(this.IFline.m*p31.x + this.IFline.b - p31.y) >= 0) {
            return p31;
        } else {
            return p32;
        }

    }

    calcIntersectNodeLine(initialNode, finalNode) {
        let IF = this.calcLineEquation(initialNode, finalNode);

        let m = IF.m;
        let b = IF.b;

        let x0 = initialNode.x;
        let y0 = initialNode.y;
        let r = initialNode.r;
        let A = 1 + m**2;
        let B = (-2*x0) + (2*m*b) - (2*m*y0);
        let C = x0**2 + b**2 - (2*b*y0) + y0**2 - r**2;

        let xi1 = ((-B) + sqrt(B**2 - (4*A*C))) / (2*A);
        let xi2 = ((-B) - sqrt(B**2 - (4*A*C))) / (2*A);
        let yi1 = m*xi1 + b;
        let yi2 = m*xi2 + b;

        if (dist(xi1, yi1, finalNode.x, finalNode.y) < dist(xi2, yi2, finalNode.x, finalNode.y)) {
            return {x: xi1, y: yi1};
        } else {
            return {x: xi2, y: yi2};
        }
    }

    midArc() {
        let x = cos((this.IQFarc.startAng+this.IQFarc.endAng)/2)*this.IQFarc.r + this.IQFarc.c.x;
        let y = sin((this.IQFarc.startAng+this.IQFarc.endAng)/2)*this.IQFarc.r + this.IQFarc.c.y;

        let qRelativeToIF = this.q.y >= this.IFline.m*this.q.x + this.IFline.b? -1 : 1;
        let midRelativeToIF = y >= this.IFline.m*x + this.IFline.b ? -1 : 1;
        if (qRelativeToIF*midRelativeToIF > 0) {
            return {
                x: x,
                y: y
            };
        } else {
            return {
                x: cos((this.IQFarc.startAng+this.IQFarc.endAng)/2 + PI)*this.IQFarc.r + this.IQFarc.c.x,
                y: sin((this.IQFarc.startAng+this.IQFarc.endAng)/2 + PI)*this.IQFarc.r + this.IQFarc.c.y
            }
        }

    }
}