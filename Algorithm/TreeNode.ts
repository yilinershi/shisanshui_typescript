import { CompareResult, NormalType, Util } from "./Define";
import { Poker } from "./Poker";

export class TreeNode {
    public normalType: NormalType
    public pokers: Array<Poker> = new Array<Poker>();
    public rest: Array<Poker> = new Array<Poker>();
    public dui: Dui
    public liangDui: LiangDui
    public sanTiao: SanTiao
    public tieZhi: TieZhi
    public huLu: HuLu

    public ToString(): string {
        var pokerDesc = ""
        this.pokers.forEach(poker => {
            pokerDesc += poker.Desc
        });

        var restDesc = ""
        this.rest.forEach(poker => {
            restDesc += poker.Desc
        });

        return `结点：{类型=【${Util.NormalTypeToString(this.normalType)}】,左节点=【${pokerDesc}】,右节点=【${restDesc}】}`
    }

    /**
    * 牌型间的外部比较，用于比较大小
    * @param other 另一个牌型节点
    * @returns 结果
    */
    public CompareExternal(other: TreeNode): CompareResult {
        if (this.normalType > other.normalType) {
            return CompareResult.Better
        }
        if (this.normalType < other.normalType) {
            return CompareResult.Worse
        }

        switch (this.normalType) {
            case NormalType.WU_LONG:
                return this.ComparePokerScore(this.pokers, other.pokers)
            case NormalType.TONG_HUA_SHUN:
                return this.ComparePokerScore(this.pokers, other.pokers)
            case NormalType.TONG_HUA:
                return this.ComparePokerScore(this.pokers, other.pokers)
            case NormalType.SHUN_ZI:
                return this.ComparePokerScore(this.pokers, other.pokers)
            case NormalType.DUI_ZI:
                return this.dui.CompareExternal(other.dui)
            case NormalType.SAN_TIAO:
                return this.sanTiao.CompareExternal(other.sanTiao)
            case NormalType.HU_LU:
                return this.huLu.CompareExternal(other.huLu)
            case NormalType.TIE_ZHI:
                return this.tieZhi.CompareExternal(other.tieZhi)
        }
    }

    /**
     * 比较两组牌的分值，循环依次比较两组牌的每一张牌
     * @param pokerArray1 
     * @param pokerArray2 
     * @returns 
     */
    private ComparePokerScore(pokerArray1: Array<Poker>, pokerArray2: Array<Poker>): CompareResult {
        Util.SortPoker(pokerArray1)
        Util.SortPoker(pokerArray2)

        var count1 = pokerArray1.length
        var count2 = pokerArray2.length
        var min = 0
        if (count1 > count2) {
            min = count2
        } else {
            min = count1
        }

        for (let index = 1; index <= min; index++) {
            const poker1 = pokerArray1[count1 - index];
            const poker2 = pokerArray2[count2 - index];
            if (poker1.Score > poker2.Score) {
                return CompareResult.Better
            }
            else if (poker1.Score < poker2.Score) {
                return CompareResult.Worse
            }
        }

        if (count1 > count2) {
            return CompareResult.Better
        }
        if (count1 < count2) {
            return CompareResult.Worse
        }
        return CompareResult.Same
    }
}


export class Dui {
    DuiScore: number //对
    Dan1Score: number //最小的单
    Dan2Score: number //次小的单
    Dan3Score: number //最大的单

    /**
     * 对子的外部比较，对越大越好，单牌也越大越好
     * @param other 
     * @returns 结果
     */
    public CompareExternal(other: Dui): CompareResult {
        if (this.DuiScore > other.DuiScore) {
            return CompareResult.Better
        }
        else if (this.DuiScore < other.DuiScore) {
            return CompareResult.Worse
        }

        if (this.Dan3Score > other.Dan3Score) {
            return CompareResult.Better
        }
        else if (this.Dan3Score < other.Dan3Score) {
            return CompareResult.Worse
        }

        if (this.Dan2Score > other.Dan2Score) {
            return CompareResult.Better
        }
        else if (this.Dan2Score < other.Dan2Score) {
            return CompareResult.Worse
        }

        if (this.Dan1Score > other.Dan1Score) {
            return CompareResult.Better
        }
        else if (this.Dan1Score < other.Dan1Score) {
            return CompareResult.Worse
        }
        return CompareResult.Same
    }

}

export class LiangDui {
    Dui1Score: number
    Dui2Score: number
    DanScore: number //最小的单

    /**
     * 两对的外部比较，所有牌是越大越好
     * @param other 另一个两对
     * @returns 
     */
    public CompareExternal(other: LiangDui): CompareResult {
        if (this.Dui1Score > other.Dui1Score) {
            return CompareResult.Better
        } else if (this.Dui1Score < other.Dui1Score) {
            return CompareResult.Worse
        }
        if (this.Dui2Score > other.Dui2Score) {
            return CompareResult.Better
        } else if (this.Dui2Score < other.Dui2Score) {
            return CompareResult.Worse
        }
        if (this.DanScore > other.DanScore) {
            return CompareResult.Better
        } else if (this.DanScore < other.DanScore) {
            return CompareResult.Worse
        }
        return CompareResult.Same
    }
}

export class SanTiao {
    SanTiaoScore: number //三条的点
    Dan1Score: number //大一点的单张
    Dan2Score: number //小一点的单张


    /**
    * 葫芦的外部比较,仅需要比较当SanTiaoScore
    * @param other 其它的葫芦
    * @returns 结果
    */
    public CompareExternal(other: SanTiao): CompareResult {
        if (this.SanTiaoScore > other.SanTiaoScore) {
            return CompareResult.Better
        } else if (this.SanTiaoScore < other.SanTiaoScore) {
            return CompareResult.Worse
        }
        return CompareResult.Same
    }
}

export class TieZhi {
    TieZhiScore: number
    DanScore: number

    /**
     * 铁支的外部比较,外部比较不用比较单牌，因为别人不可能相同的铁支
     * @param other 
     * @returns 
     */
    public CompareExternal(other: TieZhi): CompareResult {
        if (this.TieZhiScore > other.TieZhiScore) {
            return CompareResult.Better
        }
        if (this.TieZhiScore < other.TieZhiScore) {
            return CompareResult.Worse
        }
        return CompareResult.Same
    }
}

export class HuLu {
    HuLuScore: number
    DuiScore: number

    /**
     *  葫芦也的外部比较，因为两个不同牌型，三条肯定不一样
     * @param other 
     * @returns 
     */
    public CompareExternal(other: HuLu): CompareResult {
        if (this.HuLuScore > other.HuLuScore) {
            return CompareResult.Better
        }
        if (this.HuLuScore < other.HuLuScore) {
            return CompareResult.Worse
        }
        return CompareResult.Same
    }

}
