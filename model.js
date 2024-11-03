
export function Box(name, w, l, h) {
    this.boxName = name;
    this.width_x = w;
    this.length_y = l;
    this.height_z = h;
    this.volume = this.width_x * this.length_y * this.height_z;
}

export class ItemPlacement {
    constructor(name, caseBox, itemBox, numItemBox_Width, numItemBox_Length, numItemBox_Height, itemBox_width_dir, itemBox_length_dir, itemBox_height_dir) {
        this.name = name;
        this.caseBox = caseBox;
        this.itemBox = itemBox;
        this.numItemBox_Width = numItemBox_Width;
        this.numItemBox_Length = numItemBox_Length;
        this.numItemBox_Height = numItemBox_Height;
        this.itemBox_width_dir = itemBox_width_dir;
        this.itemBox_length_dir = itemBox_length_dir;
        this.itemBox_height_dir = itemBox_height_dir;
    }

    get numOfItemBox() {
        return this.numItemBox_Width * this.numItemBox_Length * this.numItemBox_Height;
    }
}