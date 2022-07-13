export default class TileManager extends Phaser.GameObjects.Group {
    private cols: number;
    private rows: number;
    private grid: Phaser.Math.Vector3[][];
    private rnd = new Phaser.Math.RandomDataGenerator([
        `${Phaser.Math.Between(0, 1000)}`,
    ]);

    constructor(
        scene: Phaser.Scene,
        cols: number,
        rows: number,
        grid: Phaser.Math.Vector3[][]
    ) {
        super(scene);

        this.cols = cols;
        this.rows = rows;
        this.grid = grid;

        this.initTiles();
        this.scene.add.existing(this);
    }

    public createTile() {
        const positionsAll = this.grid.flat().map((element) => element.z);
        const childs = this.getMatching("active", true);
        const positionsBusy = childs.map((element: Tile) => {
            return element.grid_position;
        });
        
        const positionsAllPhaser = new Phaser.Structs.Set(positionsAll);
        const positionsBusyPhaser = new Phaser.Structs.Set(positionsBusy);
        const positionsFreePhaser =
            positionsAllPhaser.difference(positionsBusyPhaser);
        
        const tileid = this.rnd.pick(positionsFreePhaser.getArray());
        const newTile = this.getFirstDead() as Tile;
        try{
            newTile.setGridPosition(tileid, this.grid, this.cols, this.rows);
            newTile.activate();
        }
        catch{
            console.log("No more space to create a tile");
        }
        
    }

    private destroyTile(x: number, y: number) {
        const tile = this.get(x, y);
        tile?.clear();
    }

    private initTiles() {
        for (let i = 0; i < this.cols * this.rows; i++) {
            this.add(new Tile(this.scene));
        }
    }
}

class Tile extends Phaser.GameObjects.Image {
    public grid_position = -1;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, "tiles", 0);
        this.setScale(0.5);
        this.clear();
        this.setDepth(1);
        this.scene.add.existing(this);
    }

    public setGridPosition(
        position: number,
        grid: Phaser.Math.Vector3[][],
        cols: number,
        rows: number
    ) {
        this.grid_position = position;
        this.x = grid[Math.floor(position / cols)][position % rows].x;
        this.y = grid[Math.floor(position / cols)][position % rows].y;
    }

    public clearGridPosition() {
        this.grid_position = -1;
    }

    public clear() {
        this.setVisible(false);
        this.setActive(false);
        this.clearGridPosition();
    }

    public activate() {
        this.setVisible(true);
        this.setActive(true);
    }
}
