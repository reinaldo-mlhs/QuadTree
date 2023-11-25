class Boundary {
    constructor(center, halfDimension) {
        this.center = center;
        this.halfDimension = halfDimension;
    }

    containsPoint(point) {
        const x1 = this.center.x - this.halfDimension;
        const y1 = this.center.y - this.halfDimension;
        const x2 = this.center.x + this.halfDimension;
        const y2 = this.center.y + this.halfDimension;

        if (point.x >= x1 && point.x < x2) {
            if (point.y >= y1 && point.y < y2) {
                return true;
            }
        }

        return false;
    }

    intersectsRange(range) {
        const aX1 = range.center.x - range.halfDimension;
        const aY1 = range.center.y - range.halfDimension;
        const aX2 = range.center.x + range.halfDimension;
        const aY2 = range.center.y + range.halfDimension;

        const bX1 = this.center.x - this.halfDimension;
        const bY1 = this.center.y - this.halfDimension;
        const bX2 = this.center.x + this.halfDimension;
        const bY2 = this.center.y + this.halfDimension;

        if (aX1 < bX2 && aX2 > bX1 && aY1 < bY2 && aY2 > bY1) {
            return true;
        }

        return false;
    }
}

class QuadTree {
    constructor(boundary) {
        this.capacity = 8;
        this.boundary = boundary;
        this.entities = [];

        this.northWest = null;
        this.northEast = null;
        this.southEast = null;
        this.southWest = null;
    }

    insert(entity) {

        const point = entity.point;

        if (!this.boundary.containsPoint(point)) {
            return false;
        }

        if (this.entities.length < this.capacity && this.northWest === null) {
            this.entities.push(entity);
            return true;
        }

        if (this.northWest === null) {
            this.subdivide();
        }

        if (this.northWest.insert(entity)) {
            return true;
        }
        else if (this.northEast.insert(entity)) {
            return true;
        }
        else if (this.southWest.insert(entity)) {
            return true;
        }
        else if (this.southEast.insert(entity)) {
            return true;
        }

        return false;
    }

    subdivide() {
        const northWestCenter = {x: this.boundary.center.x - (this.boundary.halfDimension / 2), y: this.boundary.center.y - (this.boundary.halfDimension / 2)}
        this.northWest = new QuadTree(new Boundary(northWestCenter, this.boundary.halfDimension / 2));

        const northEastCenter = {x: this.boundary.center.x + (this.boundary.halfDimension / 2), y: this.boundary.center.y - (this.boundary.halfDimension / 2)}
        this.northEast = new QuadTree(new Boundary(northEastCenter, this.boundary.halfDimension / 2));

        const southWestCenter = {x: this.boundary.center.x - (this.boundary.halfDimension / 2), y: this.boundary.center.y + (this.boundary.halfDimension / 2)}
        this.southWest = new QuadTree(new Boundary(southWestCenter, this.boundary.halfDimension / 2));

        const southEastCenter = {x: this.boundary.center.x + (this.boundary.halfDimension / 2), y: this.boundary.center.y + (this.boundary.halfDimension / 2)}
        this.southEast = new QuadTree(new Boundary(southEastCenter, this.boundary.halfDimension / 2));
    }

    queryRange(range) {

        const entitiesInRange = [];

        if (!this.boundary.intersectsRange(range)) {
            return entitiesInRange;
        }

        this.entities.forEach(entity => {
            
            if (range.containsPoint(entity.point)) {
                entitiesInRange.push(entity);
            }
        })

        if (this.northWest === null) {
            return entitiesInRange;
        }
        
        entitiesInRange.push(this.northWest.queryRange(range));
        entitiesInRange.push(this.northEast.queryRange(range));
        entitiesInRange.push(this.southWest.queryRange(range));
        entitiesInRange.push(this.southEast.queryRange(range));

        return entitiesInRange.flat();

    }

    update(entities) {
        this.entities = [];

        this.northWest = null;
        this.northEast = null;
        this.southEast = null;
        this.southWest = null;

        entities.forEach(entity => this.insert(entity));
    }
}