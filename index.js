let nodes = []
let transitions = [];
let loops = []
let selectedNode;
let selectedTransition;
let selectedLoop;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 5; i++) {
        nodes.push(new Node(String.fromCharCode(65+i), random([true, false])));
    }
    nodes.push(new Node("error", false, true));
    transitions.push(new Transition(nodes[0], nodes[1], ["a"]));
    transitions.push(new Transition(nodes[1], nodes[2], ["b"]));
    transitions.push(new Transition(nodes[1], nodes[3], ["a", "b"]));
    transitions.push(new Transition(nodes[2], nodes[3], ["a"]));
    transitions.push(new Transition(nodes[3], nodes[4], ["a", "b"]));
    transitions.push(new Transition(nodes[3], nodes[1], ["b"]));
    transitions.push(new Transition(nodes[4], nodes[5], ["a", "b"]));
    loops.push(new Loop(nodes[0], ["λ"]));
    loops.push(new Loop(nodes[1], ["a"]));
    loops.push(new Loop(nodes[3], ["a"]));


}

function draw() {
    background(255);
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

function mousePressed() {
    selectElement();
}

function mouseDragged() {
    if(selectedNode) {
        if (mouseInsideNode(selectedNode)) {
            selectedNode.x = mouseX;
            selectedNode.y = mouseY;
            
            let affectedTransitions = transitionsOf(selectedNode);
            for (t of affectedTransitions) {
                if (t.type == 'arc') {
                    while (dist(t.q.x, t.q.y, selectedNode.x, selectedNode.y) < selectedNode.r) {
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
            selectElement();
        }
    } else if (selectedTransition) {
        if (mouseOverTransition(selectedTransition)) {
            let t = selectedTransition;
            if (selectedTransition.type == 'arc') {

                let xRight = t.i.x >= t.f.x ? t.i.x : t.f.x;
                let xLeft = t.i.x < t.f.x ? t.i.x : t.f.x;
                let yTop = t.i.y >= t.f.y ? t.i.y : t.f.y;
                let yBottom = t.i.y < t.f.y ? t.i.y : t.f.y;
                
                let distanceQtoIF = abs(t.IFline.m*t.q.x - t.q.y + t.IFline.b)/sqrt(t.IFline.m**2 + 1);

                if (distanceQtoIF < 12 && mouseX > xLeft && mouseX < xRight && mouseY < yTop && mouseY > yBottom) {
                    selectedTransition.q = null;
                    selectedTransition.update();
                } else {
                    selectedTransition.q = {x: mouseX, y: mouseY};
                }
            } else {
                let distanceMousetoIF = abs(t.IFline.m*mouseX - mouseY + t.IFline.b)/sqrt(t.IFline.m**2 + 1);
                if (distanceMousetoIF > 12) {
                    selectedTransition.q = {x: mouseX, y: mouseY};
                    selectedTransition.update();
                }
            }
            
        } else {
            selectElement();
        }
    } else if (selectedLoop) {
        if (mouseOverLoop(selectedLoop)) {
            let ang = atan((mouseY-selectedLoop.n.y)/(mouseX-selectedLoop.n.x));
            if (mouseX < selectedLoop.n.x) {
                ang += PI;
            }
            selectedLoop.ang = ang;
            selectedLoop.update();
        } else {
            selectElement();
        }
    } else {
        selectElement();
    } 
}

// function doubleClicked() {
//     selectElement();
//     if (selectedNode && !selectedNode.error) {
//         selectedNode.final = !selectedNode.final;
//     }
// }

function deselectAll() {
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

function selectElement() {
    deselectAll();
    for (n of nodes) {
        if (mouseInsideNode(n)) {
            n.selected = true;
            selectedNode = n;
            return 0;
        }
    }

    for (l of loops) {
        if (mouseOverLoop(l)) {
            l.selected = true;
            selectedLoop = l;
            return 0;
        }
    }

    for (t of transitions) {
        if (mouseOverTransition(t)) {
            t.selected = true;
            selectedTransition = t;
            return 0;
        }
    }
}

function mouseInsideNode(n) {
    if (mouseX < n.x+n.r &&  mouseX > n.x-n.r && mouseY < n.y+n.r &&  mouseY > n.y-n.r) {
        return true;
    }
    return false;
}

function mouseOverTransition(t) {
    if (t.type == "line") {
        let xRight = t.IFsegment.xi >= t.IFsegment.xf ? t.IFsegment.xi : t.IFsegment.xf;
        let xLeft = t.IFsegment.xi < t.IFsegment.xf ? t.IFsegment.xi : t.IFsegment.xf;
        let yTop = t.IFsegment.yi >= t.IFsegment.yf ? t.IFsegment.yi : t.IFsegment.yf;
        let yBottom = t.IFsegment.yi < t.IFsegment.yf ? t.IFsegment.yi : t.IFsegment.yf;

        if (mouseX > xLeft-12 && mouseX < xRight+12 && mouseY < yTop+12 && mouseY > yBottom-12) {
            let distance = abs(t.IFline.m*mouseX - mouseY + t.IFline.b)/sqrt(t.IFline.m**2 + 1);
            if (distance < 20) {
                return true
            }
        }
        return false;
    } else {
        if (abs(dist(mouseX, mouseY, t.IQFarc.c.x, t.IQFarc.c.y) - t.IQFarc.r) < 20) {
            let intersectRelativeToIF = t.IQFarc.intersect.i.y >= t.IFline.m*t.IQFarc.intersect.i.x + t.IFline.b? -1 : 1;
            let mouseRelativeToIF = mouseY >= t.IFline.m*mouseX + t.IFline.b ? -1 : 1;
            if (intersectRelativeToIF*mouseRelativeToIF > 0) {
                return true;
            } else if (abs(t.IFline.m*t.IQFarc.intersect.i.x - t.IQFarc.intersect.i.y + t.IFline.b)/sqrt(t.IFline.m**2 + 1) < 10) {
                return true;
            }
        }
        return false;
    }
}

function mouseOverLoop(l) {
    if (mouseX < l.c.x+l.r+15 &&  mouseX > l.c.x-l.r-15 && mouseY < l.c.y+l.r+15 &&  mouseY > l.c.y-l.r-15) {
        return true;
    }
    return false;
}

function transitionsOf(node) {
    let ts = [];

    for (t of transitions) {
        if (t.i == node || t.f == node) {
            ts.push(t);
        }
    }

    return ts;
}
