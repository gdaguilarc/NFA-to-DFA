let two = function(sketch) { 
    class Node {
        constructor(name, initial = false, final = false, error = false) {
            if (sketch.textWidth(name) < 20) {
                this.r = 35;
            } else if (sketch.textWidth(name) < 35) {
                this.r = sketch.textWidth(name) + 15;
            } else {
                this.r = 48;
            }
            if (initial) {
                this.x = 100;
                this.y = sketch.height/2;

            } else {
                let zone = sketch.random([1,2,3,4])
                if (zone == 1) {
                    this.x = sketch.random(200 + this.r, 400 - this.r);
                } else if (zone == 2) {
                    this.x = sketch.random(400 + this.r, 600 - this.r);
                } else if (zone == 3) {
                    this.x = sketch.random(600 + this.r, 800 - this.r);
                } else {
                    this.x = sketch.random(800 + this.r, 1000 - this.r);
                }

                this.y = sketch.random(0 + this.r, sketch.height - this.r);
            }
            this.name = name;
            this.selected = false;
            this.initial = initial;
            this.final = final;
            this.error = error;
        }
    
        show() {
            if (this.error) {
                sketch.stroke(255, 0, 0);
                sketch.fill(255, 0, 0);
            } else if (this.selected) {
                sketch.stroke(0, 0, 255);
                sketch.fill(0, 0, 255);
            } else {
                sketch.stroke(0);
                sketch.fill(0);
            }

            sketch.strokeWeight(1.5);
            sketch.textAlign(sketch.CENTER);
            if (this.name == "") {
                sketch.textSize(27);
                sketch.text("error", this.x, this.y+10)
            } else {
                if (this.r > 40) {
                    sketch.textSize(20);
                } else {
                    sketch.textSize(30);
                }
                sketch.text(this.name, this.x, this.y+10)
            }
    
            sketch.noFill();
            sketch.strokeWeight(3);
            sketch.ellipse(this.x, this.y, this.r*2);
            if (this.final) {
                sketch.ellipse(this.x, this.y, this.r*2-12);
            } else if (this.initial) {
                sketch.strokeWeight(2);
                sketch.line(this.x-this.r, this.y, this.x-this.r - 20, this.y + 20);
                sketch.line(this.x-this.r, this.y, this.x-this.r - 20, this.y - 20);
            }
    
        }
    }

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
                    sketch.stroke(0, 0, 255);
                    sketch.fill(0, 0, 255);
                } else {
                    sketch.stroke(0);
                    sketch.fill(0);
    
                }
    
                sketch.textSize(20);
                sketch.strokeWeight(1);
                if (this.IFline.m < 1) {
                    sketch.text(this.nameString, (this.IFsegment.xi + this.IFsegment.xf)/2, (this.IFsegment.yi + this.IFsegment.yf)/2 - 25)
                } else {
                    sketch.text(this.nameString, (this.IFsegment.xi + this.IFsegment.xf)/2 + 25, (this.IFsegment.yi + this.IFsegment.yf)/2)
                }
    
                sketch.strokeWeight(2);
                sketch.line(this.IFsegment.xi, this.IFsegment.yi, this.IFsegment.xf, this.IFsegment.yf);
                sketch.push();
                sketch.translate(this.IFsegment.xf, this.IFsegment.yf);
                sketch.rotate(sketch.atan(this.IFline.m));
                if (this.IFsegment.xi <= this.IFsegment.xf) {
                    sketch.line(0,0,-15,10);
                    sketch.line(0,0,-15,-10);
                } else {
                    sketch.line(0,0,15,10);
                    sketch.line(0,0,15,-10);
                }    
                sketch.pop();         
    
            } else {
                sketch.noFill();
                if (this.selected) {
                    sketch.stroke(0, 0, 255);
                    sketch.fill(0, 0, 255);
                } else {
                    sketch.stroke(0);
                    sketch.fill(0);
    
                }
    
                let mid = this.midArc();
                sketch.textSize(20);
                sketch.strokeWeight(1);
                if (this.IFline.m < 1) {
                    sketch.text(this.nameString, mid.x, mid.y - 25);
                } else {
                    sketch.text(this.nameString, mid.x + 25, mid.y);
                }
    
                sketch.noFill();
                sketch.strokeWeight(2);
                sketch.arc(this.IQFarc.c.x, this.IQFarc.c.y, this.IQFarc.r*2, this.IQFarc.r*2, this.IQFarc.startAng, this.IQFarc.endAng);
    
                let intersectLine = this.calcLineEquation(this.IQFarc.arrow, this.f);
                sketch.push();
                sketch.translate(this.IQFarc.arrow.x, this.IQFarc.arrow.y);
                sketch.rotate(sketch.atan(intersectLine.m));
                if (this.IQFarc.arrow.x <= this.f.x) {
                    sketch.line(0,0,-15,10);
                    sketch.line(0,0,-15,-10);
                } else {
                    sketch.line(0,0,15,10);
                    sketch.line(0,0,15,-10);
                }     
                sketch.pop();
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
    
            let r = sketch.dist(this.i.x, this.i.y, c.x, c.y);
    
            let ini = this.calcIntersectNodeCirc(this.i, c, r);
            let fin = this.calcIntersectNodeCirc(this.f, c, r);
    
            let iniCentro = this.calcLineEquation(ini, c);
            let finCentro = this.calcLineEquation(fin, c);
    
            let startAng, endAng;
            if (sketch.dist(ini.x-c.x, ini.y-c.y, sketch.cos(sketch.atan(iniCentro.m))*r, sketch.sin(sketch.atan(iniCentro.m))*r) < 1) {
                startAng = sketch.atan(iniCentro.m);
            } else {
                startAng = sketch.atan(iniCentro.m) + sketch.PI;
            }
            if (sketch.dist(fin.x-c.x, fin.y-c.y, sketch.cos(sketch.atan(finCentro.m))*r, sketch.sin(sketch.atan(finCentro.m))*r) < 1) {
                endAng = sketch.atan(finCentro.m);
            } else {
                endAng = sketch.atan(finCentro.m) + sketch.PI;
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
    
            let d = sketch.dist(p0.x, p0.y, p1.x, p1.y);
            let a = (r0**2 - r1**2 + d**2) / (2*d);
            let h = sketch.sqrt(r0**2 - a**2);
    
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
    
            let xi1 = ((-B) + sketch.sqrt(B**2 - (4*A*C))) / (2*A);
            let xi2 = ((-B) - sketch.sqrt(B**2 - (4*A*C))) / (2*A);
            let yi1 = m*xi1 + b;
            let yi2 = m*xi2 + b;
    
            if (sketch.dist(xi1, yi1, finalNode.x, finalNode.y) < sketch.dist(xi2, yi2, finalNode.x, finalNode.y)) {
                return {x: xi1, y: yi1};
            } else {
                return {x: xi2, y: yi2};
            }
        }
    
        midArc() {
            let x = sketch.cos((this.IQFarc.startAng+this.IQFarc.endAng)/2)*this.IQFarc.r + this.IQFarc.c.x;
            let y = sketch.sin((this.IQFarc.startAng+this.IQFarc.endAng)/2)*this.IQFarc.r + this.IQFarc.c.y;
    
            let qRelativeToIF = this.q.y >= this.IFline.m*this.q.x + this.IFline.b? -1 : 1;
            let midRelativeToIF = y >= this.IFline.m*x + this.IFline.b ? -1 : 1;
            if (qRelativeToIF*midRelativeToIF > 0) {
                return {
                    x: x,
                    y: y
                };
            } else {
                return {
                    x: sketch.cos((this.IQFarc.startAng+this.IQFarc.endAng)/2 + sketch.PI)*this.IQFarc.r + this.IQFarc.c.x,
                    y: sketch.sin((this.IQFarc.startAng+this.IQFarc.endAng)/2 + sketch.PI)*this.IQFarc.r + this.IQFarc.c.y
                }
            }
    
        }
    }

    class Loop {
        constructor(node, name, ang = -sketch.HALF_PI) {
            this.n = node;
            this.ang = ang;
            this.selected = false;
    
            this.r = this.n.r*0.8;
            this.c = {
                x: sketch.cos(ang)*this.r*1.75 + node.x,
                y: sketch.sin(ang)*this.r*1.75 + node.y
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
                x: sketch.cos(this.ang)*this.r*1.75 + this.n.x,
                y: sketch.sin(this.ang)*this.r*1.75 + this.n.y
            }
            this.arc = this.calcArc();
        }
    
        show() {
            if (this.selected) {
                sketch.stroke(0, 0, 255);
                sketch.fill(0, 0, 255);
            } else {
                sketch.stroke(0);
                sketch.fill(0);
            }
    
            let mid = this.midArc();
            sketch.textSize(20);
            sketch.strokeWeight(1);
            sketch.text(this.nameString, mid.x, mid.y)
    
            sketch.noFill();
            sketch.strokeWeight(2);
            sketch.arc(this.arc.c.x, this.arc.c.y, this.arc.r*2, this.arc.r*2, this.arc.startAng, this.arc.endAng);
    
            let arrowLine = this.calcLineEquation(this.arc.arrow, this.n);
            sketch.push();
            sketch.translate(this.arc.arrow.x, this.arc.arrow.y);
            sketch.rotate(sketch.atan(arrowLine.m));
            if (this.arc.arrow.x <= this.n.x) {
                sketch.line(0,0,-10,10);
                sketch.line(0,0,-10,-10);
            } else {
                sketch.line(0,0,10,10);
                sketch.line(0,0,10,-10);
            }     
            sketch.pop();
        }
    
        calcArc() {
            let points = this.calcIntersectNodeCirc(this.n, this.c, this.r);
            let a = points.a;
            let b = points.b;
     
            let aTOc = this.calcLineEquation(a, this.c);
            let bTOc = this.calcLineEquation(b, this.c);
    
            let startAng, endAng;
            if (sketch.dist(a.x-this.c.x, a.y-this.c.y, sketch.cos(sketch.atan(aTOc.m))*this.r, sketch.sin(sketch.atan(aTOc.m))*this.r) < 1) {
                startAng = sketch.atan(aTOc.m);
            } else {
                startAng = sketch.atan(aTOc.m) + sketch.PI;
            }
            if (sketch.dist(b.x-this.c.x, b.y-this.c.y, sketch.cos(sketch.atan(bTOc.m))*this.r, sketch.sin(sketch.atan(bTOc.m))*this.r) < 1) {
                endAng = sketch.atan(bTOc.m);
            } else {
                endAng = sketch.atan(bTOc.m) + sketch.PI;
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
            let x = sketch.cos((this.arc.startAng+this.arc.endAng)/2)*this.arc.r*1.5 + this.arc.c.x;
            let y = sketch.sin((this.arc.startAng+this.arc.endAng)/2)*this.arc.r*1.5 + this.arc.c.y;
    
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
                    x: sketch.cos((this.arc.startAng+this.arc.endAng)/2 + sketch.PI)*this.arc.r*1.5 + this.arc.c.x,
                    y: sketch.sin((this.arc.startAng+this.arc.endAng)/2 + sketch.PI)*this.arc.r*1.5 + this.arc.c.y
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
    
            let d = sketch.dist(p0.x, p0.y, p1.x, p1.y);
            let a = (r0**2 - r1**2 + d**2) / (2*d);
            let h = sketch.sqrt(r0**2 - a**2);
    
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

    let selectedNode;
    let selectedTransition;
    let selectedLoop;
    let nodes = [];
    let transitions = [];
    let loops = [];

    let convertion = function(dfa) {
        // console.log("dfa", dfa.states)
        for (state of dfa.states) {
            // console.log(state)
            nodes.push(new Node(state === '' ? "" : state, dfa.initial === state, dfa.final.includes(state), state === ''));
        }

        let transitions = [];
        let loops = [];
        let tempTrans = [...dfa.transitions]
        // console.log(tempTrans)
        for (let i = 0; i < tempTrans.length; i++) {
            if (tempTrans[i]) {
                let letter = [tempTrans[i].letter];
            

            for (let j = i+1; j < tempTrans.length; j++) {
                if (tempTrans[j] && tempTrans[j].initial === tempTrans[i].initial && tempTrans[j].final === tempTrans[i].final){
                    // console.log(tempTrans[i], tempTrans[j]);
                    if (!letter.includes(tempTrans[j].letter)){
                        letter.push(tempTrans[j].letter)
                    }
                    tempTrans[j] = null;
                    // console.log(letter)

                    
                }
            }

            if (tempTrans[i].initial === tempTrans[i].final) {
                loops.push(new Loop(nodes.find( (elem) => {
                    return elem.name == tempTrans[i].initial;
                }), letter));
            } else {
                transitions.push(new Transition(nodes.find( (elem) => {
                    return elem.name == tempTrans[i].initial;
                }), nodes.find( (elem) => {
                    return elem.name == tempTrans[i].final;
                }), letter))
            }


        }

        }
        //     let letters = [dfa.listTransitions()[i].letter];

        //     for (let j = i+1; j < dfa.listTransitions().length-1; j++) {
        //     if (dfa.listTransitions()[i].initial === dfa.listTransitions()[j].initial &&
        //         dfa.listTransitions()[i].final === dfa.listTransitions()[j].final) {
        //         letters.push(dfa.listTransitions()[j].letter)
        //         }
        //     }

        //     if (dfa.listTransitions()[i].initial == dfa.listTransitions()[i].final) {
        //     loops.push(new Loop(nodes.find( (elem) => {
        //         return elem.name == dfa.listTransitions()[i].initial;
        //     }), letters));
        //     } else {
        //         // console.log(nodes.find( (elem) => {
        //         //     return elem.name == dfa.listTransitions()[i].initial;
        //         // }), nodes.find( (elem) => {
        //         //     return elem.name == dfa.listTransitions()[i].final;
        //         // }), letters)
        //     transitions.push(new Transition(nodes.find( (elem) => {
        //         return elem.name === dfa.listTransitions()[i].initial;
        //     }), nodes.find( (elem) => {
        //         // console.log(dfa.listTransitions()[i])

        //         return elem.name === dfa.listTransitions()[i].final;
        //     }), letters));
        //     }
        // }

        return {n: nodes, t: transitions, l: loops};
    }


    sketch.setup = function() {
        sketch.createCanvas(1000, 700);

        let a = convertion(dfa);
        nodes = a.n;
        transitions = a.t;
        // console.log(transitions);
        loops = a.l;

        // nodes.push(new Node("A", true));
        // nodes.push(new Node("B"));
        // nodes.push(new Node("C", false, false));
        // nodes.push(new Node("error", false, false, true));
        
        // transitions.push(new Transition(nodes[0], nodes[1], ["a"]));
        // transitions.push(new Transition(nodes[1], nodes[2], ["a"]));
        // transitions.push(new Transition(nodes[1], nodes[3], ["b"]));
        // transitions.push(new Transition(nodes[2], nodes[3], ["b"]));

        // loops.push(new Loop(nodes[0], "b"));
    }

    sketch.draw = function() {
        sketch.background(255);
        for (let i = transitions.length - 1; i >=0 ; i--) {
            transitions[i].update();
            transitions[i].show();
        }
        for (let i = nodes.length - 1; i >=0 ; i--) {
            nodes[i].show();
        }
        for (let l of loops) {
            l.update();
            l.show();
        }
        
    }

    sketch.mousePressed = function() {
        sketch.selectElement();
    }

    sketch.mouseDragged = function() {
        if(selectedNode) {
            if (sketch.mouseInsideNode(selectedNode)) {
                selectedNode.x = sketch.mouseX;
                selectedNode.y = sketch.mouseY;
                
                let affectedTransitions = sketch.transitionsOf(selectedNode);
                for (t of affectedTransitions) {
                    if (t.type == 'arc') {
                        while (sketch.dist(t.q.x, t.q.y, selectedNode.x, selectedNode.y) < selectedNode.r) {
                            if (selectedNode.x < t.q.x && selectedNode.y < t.q.y) {
                                t.q.x++;
                                t.q.y++;
                            } else if (selectedNode.x < t.q.x && selectedNode.y > t.q.y) {
                                t.q.x++;
                                t.q.y--;
                            } else if (selectedNode.x > t.q.x && selectedNode.y > t.q.y) {
                                t.q.x--;
                                t.q.y--;
                            } else if (selectedNode.x > t.q.x && selectedNode.y < t.q.y) {
                                t.q.x--;
                                t.q.y++;
                            }
                        }
                    }
                }
            } else {
                sketch.selectElement();
            }
        } else if (selectedTransition) {
            if (sketch.mouseOverTransition(selectedTransition)) {
                let t = selectedTransition;
                if (selectedTransition.type == 'arc') {

                    let xRight = t.i.x >= t.f.x ? t.i.x : t.f.x;
                    let xLeft = t.i.x < t.f.x ? t.i.x : t.f.x;
                    let yTop = t.i.y >= t.f.y ? t.i.y : t.f.y;
                    let yBottom = t.i.y < t.f.y ? t.i.y : t.f.y;
                    
                    let distanceQtoIF = sketch.abs(t.IFline.m*t.q.x - t.q.y + t.IFline.b)/sketch.sqrt(t.IFline.m**2 + 1);

                    if (distanceQtoIF < 12 && sketch.mouseX > xLeft && sketch.mouseX < xRight && sketch.mouseY < yTop && sketch.mouseY > yBottom) {
                        selectedTransition.q = null;
                        selectedTransition.update();
                    } else {
                        selectedTransition.q = {x: sketch.mouseX, y: sketch.mouseY};
                    }
                } else {
                    let distanceMousetoIF = sketch.abs(t.IFline.m*sketch.mouseX - sketch.mouseY + t.IFline.b)/sketch.sqrt(t.IFline.m**2 + 1);
                    if (distanceMousetoIF > 12) {
                        selectedTransition.q = {x: sketch.mouseX, y: sketch.mouseY};
                        selectedTransition.update();
                    }
                }
                
            } else {
                sketch.selectElement();
            }
        } else if (selectedLoop) {
            if (sketch.mouseOverLoop(selectedLoop)) {
                let ang = sketch.atan((sketch.mouseY-selectedLoop.n.y)/(sketch.mouseX-selectedLoop.n.x));
                if (sketch.mouseX < selectedLoop.n.x) {
                    ang += sketch.PI;
                }
                selectedLoop.ang = ang;
                selectedLoop.update();
            } else {
                sketch.selectElement();
            }
        } else {
            sketch.selectElement();
        } 
    }

    // function doubleClicked() {
    //     sketch.selectElement();
    //     if (selectedNode && !selectedNode.error) {
    //         selectedNode.final = !selectedNode.final;
    //     }
    // }

    sketch.deselectAll = function() {
        selectedNode = null;
        selectedTransition = null;
        selectedLoop = null;
        for (n of nodes) {
            n.selected = false;
        }
        for (t of transitions) {
            t.selected = false;
        }
        for (l of loops) {
            l.selected = false;
        }
    }

    sketch.selectElement = function() {
        sketch.deselectAll();
        for (n of nodes) {
            if (sketch.mouseInsideNode(n)) {
                n.selected = true;
                selectedNode = n;
                return 0;
            }
        }

        for (l of loops) {
            if (sketch.mouseOverLoop(l)) {
                l.selected = true;
                selectedLoop = l;
                return 0;
            }
        }

        for (t of transitions) {
            if (sketch.mouseOverTransition(t)) {
                t.selected = true;
                selectedTransition = t;
                return 0;
            }
        }
    }

    sketch.mouseInsideNode = function(n) {
        if (sketch.mouseX < n.x+n.r &&  sketch.mouseX > n.x-n.r && sketch.mouseY < n.y+n.r &&  sketch.mouseY > n.y-n.r) {
            return true;
        }
        return false;
    }

    sketch.mouseOverTransition = function(t) {
        if (t.type == "line") {
            let xRight = t.IFsegment.xi >= t.IFsegment.xf ? t.IFsegment.xi : t.IFsegment.xf;
            let xLeft = t.IFsegment.xi < t.IFsegment.xf ? t.IFsegment.xi : t.IFsegment.xf;
            let yTop = t.IFsegment.yi >= t.IFsegment.yf ? t.IFsegment.yi : t.IFsegment.yf;
            let yBottom = t.IFsegment.yi < t.IFsegment.yf ? t.IFsegment.yi : t.IFsegment.yf;

            if (sketch.mouseX > xLeft-12 && sketch.mouseX < xRight+12 && sketch.mouseY < yTop+12 && sketch.mouseY > yBottom-12) {
                let distance = sketch.abs(t.IFline.m*sketch.mouseX - sketch.mouseY + t.IFline.b)/sketch.sqrt(t.IFline.m**2 + 1);
                if (distance < 20) {
                    return true
                }
            }
            return false;
        } else {
            if (sketch.abs(sketch.dist(sketch.mouseX, sketch.mouseY, t.IQFarc.c.x, t.IQFarc.c.y) - t.IQFarc.r) < 20) {
                let intersectRelativeToIF = t.IQFarc.intersect.i.y >= t.IFline.m*t.IQFarc.intersect.i.x + t.IFline.b? -1 : 1;
                let mouseRelativeToIF = sketch.mouseY >= t.IFline.m*sketch.mouseX + t.IFline.b ? -1 : 1;
                if (intersectRelativeToIF*mouseRelativeToIF > 0) {
                    return true;
                } else if (sketch.abs(t.IFline.m*t.IQFarc.intersect.i.x - t.IQFarc.intersect.i.y + t.IFline.b)/sketch.sqrt(t.IFline.m**2 + 1) < 10) {
                    return true;
                }
            }
            return false;
        }
    }

    sketch.mouseOverLoop = function(l) {
        if (sketch.mouseX < l.c.x+l.r+15 &&  sketch.mouseX > l.c.x-l.r-15 && sketch.mouseY < l.c.y+l.r+15 &&  sketch.mouseY > l.c.y-l.r-15) {
            return true;
        }
        return false;
    }

    sketch.transitionsOf = function(node) {
        let ts = [];

        for (t of transitions) {
            if (t.i == node || t.f == node) {
                ts.push(t);
            }
        }

        return ts;
    }
}

