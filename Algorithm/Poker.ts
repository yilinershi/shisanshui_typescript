import { PokerHua, PokerPoint, Util } from "./Define"


export class Poker {
    public Point: PokerPoint
    public Hua: PokerHua
    public Score: number
    public Desc: string
    public ASCII: number  //十六进制
    public constructor(point: PokerPoint, hua: PokerHua) {
        this.Point = point
        this.Hua = hua
        this.ASCII = (hua - 1) * 16 + point
        this.Score = Util.PokerPointToShiSanShuiScore(this.Point)
        this.Desc = Util.PokerHuaToString(this.Hua) + Util.PokerPointToString(this.Point)
    }
}
