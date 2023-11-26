class Boundary {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }

    containsPointRect(point) {
        const x1 = this.center.x - this.radius;
        const y1 = this.center.y - this.radius;
        const x2 = this.center.x + this.radius;
        const y2 = this.center.y + this.radius;

        if (point.x >= x1 && point.x < x2) {
            if (point.y >= y1 && point.y < y2) {
                return true;
            }
        }

        return false;
    }

    containsPointCircle(point) {
        const distance = Math.sqrt((Math.pow(point.x - this.center.x, 2)) + (Math.pow(point.y - this.center.y, 2)));

        if (distance <= this.radius) {
            return true;
        }

        return false;
    }

    intersectsRangeRect(range) {
        const aX1 = range.center.x - range.radius;
        const aY1 = range.center.y - range.radius;
        const aX2 = range.center.x + range.radius;
        const aY2 = range.center.y + range.radius;

        const bX1 = this.center.x - this.radius;
        const bY1 = this.center.y - this.radius;
        const bX2 = this.center.x + this.radius;
        const bY2 = this.center.y + this.radius;

        if (aX1 < bX2 && aX2 > bX1 && aY1 < bY2 && aY2 > bY1) {
            return true;
        }

        return false;
    }

}

class QuadTree {
    constructor(boundary, capacity = 8) {
        this.capacity = capacity;
        this.boundary = boundary;
        this.entities = [];

        this.northWest = null;
        this.northEast = null;
        this.southEast = null;
        this.southWest = null;
    }

    insert(entity) {

        const point = entity.point;

        if (!this.boundary.containsPointRect(point)) {
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
        const northWestCenter = {x: this.boundary.center.x - (this.boundary.radius / 2), y: this.boundary.center.y - (this.boundary.radius / 2)}
        this.northWest = new QuadTree(new Boundary(northWestCenter, this.boundary.radius / 2));

        const northEastCenter = {x: this.boundary.center.x + (this.boundary.radius / 2), y: this.boundary.center.y - (this.boundary.radius / 2)}
        this.northEast = new QuadTree(new Boundary(northEastCenter, this.boundary.radius / 2));

        const southWestCenter = {x: this.boundary.center.x - (this.boundary.radius / 2), y: this.boundary.center.y + (this.boundary.radius / 2)}
        this.southWest = new QuadTree(new Boundary(southWestCenter, this.boundary.radius / 2));

        const southEastCenter = {x: this.boundary.center.x + (this.boundary.radius / 2), y: this.boundary.center.y + (this.boundary.radius / 2)}
        this.southEast = new QuadTree(new Boundary(southEastCenter, this.boundary.radius / 2));
    }

    queryRangeRect(range) {

        const entitiesInRange = [];

        if (!this.boundary.intersectsRangeRect(range)) {
            return entitiesInRange;
        }

        this.entities.forEach(entity => {
            
            if (range.containsPointRect(entity.point)) {
                entitiesInRange.push(entity);
            }
        })

        if (this.northWest === null) {
            return entitiesInRange;
        }
        
        entitiesInRange.push(this.northWest.queryRangeRect(range));
        entitiesInRange.push(this.northEast.queryRangeRect(range));
        entitiesInRange.push(this.southWest.queryRangeRect(range));
        entitiesInRange.push(this.southEast.queryRangeRect(range));

        return entitiesInRange.flat();

    }

    queryRangeCircle(range) {

        const entitiesInRange = [];

        if (!this.boundary.intersectsRangeRect(range)) {
            return entitiesInRange;
        }

        this.entities.forEach(entity => {
            
            if (range.containsPointCircle(entity.point)) {
                entitiesInRange.push(entity);
            }
        })

        if (this.northWest === null) {
            return entitiesInRange;
        }
        
        entitiesInRange.push(this.northWest.queryRangeCircle(range));
        entitiesInRange.push(this.northEast.queryRangeCircle(range));
        entitiesInRange.push(this.southWest.queryRangeCircle(range));
        entitiesInRange.push(this.southEast.queryRangeCircle(range));

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