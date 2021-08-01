import { Poker } from "./Poker"

export enum NormalType {
    WU_LONG = 0,
    DUI_ZI = 1,
    LIANG_DUI = 2,
    SAN_TIAO = 3,
    SHUN_ZI = 4,
    TONG_HUA = 5,
    HU_LU = 6,
    TIE_ZHI = 7,
    TONG_HUA_SHUN = 8,
}


export enum SpecialType {
    None = 0,
    ZhiZunQingLong = 1,
    YiTiaoLong = 2,
    ShiErHuangZu = 3,
    SanTongHuaShun = 4,
    SanFenTianXia = 5,
    QuanDa = 6,
    QuanXiao = 7,
    ChouYiSe = 8,
    SiTaoSanTiao = 9,
    WuDuiSanTiao = 10,
    LiuDuiBan = 11,
    SanSunZi = 12,
    SanTongHua = 13,
}

export enum PokerPoint {
    PokerNone = 0,
    PokerA = 1,
    Poker2 = 2,
    Poker3 = 3,
    Poker4 = 4,
    Poker5 = 5,
    Poker6 = 6,
    Poker7 = 7,
    Poker8 = 8,
    Poker9 = 9,
    PokerT = 10,
    PokerJ = 11,
    PokerQ = 12,
    PokerK = 13,
}

export enum PokerHua {
    HuaNone = 0,
    Hua1 = 1,
    Hua2 = 2,
    Hua3 = 3,
    Hua4 = 4,
}

export enum CompareResult {
    Same = 0,
    Better = 1,
    Worse = 2,
}


export class Util {

    /**
     * 给扑克排序，按花色及分值从小到大的顺序
     * @param pokers 
     */
    public static SortPoker(pokers: Array<Poker>) {
        pokers.sort((a, b) => {
            if (a.Score == b.Score) {
                return a.Hua - b.Hua
            }
            return a.Score - b.Score
        })
    }

    /**
     * 将NormalType转成中文
     * @param e:NormalType
     * @returns 中文
     */
    public static NormalTypeToString(e: NormalType): string {
        switch (e) {
            case NormalType.WU_LONG:
                return "乌龙"
            case NormalType.DUI_ZI:
                return "对子"
            case NormalType.LIANG_DUI:
                return "两对"
            case NormalType.SAN_TIAO:
                return "三条"
            case NormalType.SHUN_ZI:
                return "顺子"
            case NormalType.TONG_HUA:
                return "同花"
            case NormalType.HU_LU:
                return "葫芦"
            case NormalType.TIE_ZHI:
                return "铁支"
            case NormalType.TONG_HUA_SHUN:
                return "同花顺"
            default:
                return "乌龙"
        }
    }


    /**
     * 将NormalType转成中文
     * @param e:NormalType
     * @returns 中文
     */
    public static SpecialTypeToString(specialType: SpecialType): string {
        switch (specialType) {
            case SpecialType.None:
                return "不是特殊牌型"
            case SpecialType.ZhiZunQingLong:
                return "至尊青龙"
            case SpecialType.YiTiaoLong:
                return "一条龙"
            case SpecialType.ShiErHuangZu:
                return "十二皇族"
            case SpecialType.SanTongHuaShun:
                return "三同花顺"
            case SpecialType.SanFenTianXia:
                return "三分天下"
            case SpecialType.QuanDa:
                return "全大"
            case SpecialType.QuanXiao:
                return "全小"
            case SpecialType.ChouYiSe:
                return "凑一色"
            case SpecialType.SiTaoSanTiao:
                return "四套三条"
            case SpecialType.WuDuiSanTiao:
                return "五对三条"
            case SpecialType.LiuDuiBan:
                return "六对半"
            case SpecialType.SanSunZi:
                return "三顺子"
            case SpecialType.SanTongHua:
                return "三同花"
            default:
                return ""
        }
    }

    /**
     * 将PokerPoint转成中文
     * @param e:PokerPoint
     * @returns 中文
     */
    public static PokerPointToString(p: PokerPoint): string {
        switch (p) {
            case PokerPoint.PokerA:
                return "A"
            case PokerPoint.Poker2:
                return "2"
            case PokerPoint.Poker3:
                return "3"
            case PokerPoint.Poker4:
                return "4"
            case PokerPoint.Poker5:
                return "5"
            case PokerPoint.Poker6:
                return "6"
            case PokerPoint.Poker7:
                return "7"
            case PokerPoint.Poker8:
                return "8"
            case PokerPoint.Poker9:
                return "9"
            case PokerPoint.PokerT:
                return "T"
            case PokerPoint.PokerJ:
                return "J"
            case PokerPoint.PokerQ:
                return "Q"
            case PokerPoint.PokerK:
                return "K"
            default:
                return ""
        }
    }

    /**
    * 该张牌的13水公值
    * @param e:PokerPoint
    * @returns 中文
    */
    public static PokerPointToShiSanShuiScore(p: PokerPoint): number {
        switch (p) {
            case PokerPoint.PokerA:
                return 14
            case PokerPoint.Poker2:
                return 2
            case PokerPoint.Poker3:
                return 3
            case PokerPoint.Poker4:
                return 4
            case PokerPoint.Poker5:
                return 5
            case PokerPoint.Poker6:
                return 6
            case PokerPoint.Poker7:
                return 7
            case PokerPoint.Poker8:
                return 8
            case PokerPoint.Poker9:
                return 9
            case PokerPoint.PokerT:
                return 10
            case PokerPoint.PokerJ:
                return 11
            case PokerPoint.PokerQ:
                return 12
            case PokerPoint.PokerK:
                return 13
            default:
                return 0
        }
    }

    /**
     * 将enum类型的PokerHua转成花色显示
     * @param hua:PokerHua
     * @returns 花色
     */
    public static PokerHuaToString(hua: PokerHua): string {
        switch (hua) {
            case PokerHua.Hua1:
                return "♦"
            case PokerHua.Hua2:
                return "♣"
            case PokerHua.Hua3:
                return "♥"
            case PokerHua.Hua4:
                return "♠"
            default:
                return ""
        }
    }

    /**
     * 字符转扑克花
     * @param str 字符
     * @returns 扑克花
     */
    public static StringToPokerHua(str: string): PokerHua {
        switch (str) {
            case "♦":
                return PokerHua.Hua1
            case "♣":
                return PokerHua.Hua2
            case "♥":
                return PokerHua.Hua3
            case "♠":
                return PokerHua.Hua4
            default:
                console.error("hua is not exist!")
                return PokerHua.HuaNone
        }
    }

    /**
     * 数值转扑克点数
     * @param str 数值
     * @returns 扑克点数
     */
    public static StringToPokerPoint(str: string): PokerPoint {
        switch (str) {
            case "A":
                return PokerPoint.PokerA
            case "2":
                return PokerPoint.Poker2
            case "3":
                return PokerPoint.Poker3
            case "4":
                return PokerPoint.Poker4
            case "5":
                return PokerPoint.Poker5
            case "6":
                return PokerPoint.Poker6
            case "7":
                return PokerPoint.Poker7
            case "8":
                return PokerPoint.Poker8
            case "9":
                return PokerPoint.Poker9
            case "T":
                return PokerPoint.PokerT
            case "J":
                return PokerPoint.PokerJ
            case "Q":
                return PokerPoint.PokerQ
            case "K":
                return PokerPoint.PokerK
            default:
                return 0
        }
    }

}
