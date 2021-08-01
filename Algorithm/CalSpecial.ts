import { CalNormal } from "./CalNormal"
import { NormalType, PokerHua, PokerPoint, SpecialType, Util } from "./Define"
import { Poker } from "./Poker"
import { Tree } from "./Tree"


export class CalSpecial {

    /**
     * 将树拆出各种节点出来
     * @param tree 
     */
    public static CalSpecialResult(tree: Tree): { IsSpecial: boolean, SpecialType: SpecialType } {
        if (this.IsZhiZunQingLong(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.ZhiZunQingLong }
        }
        if (this.IsYiTiaoLong(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.YiTiaoLong }
        }
        if (this.IsShiErHuangZu(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.ShiErHuangZu }
        }
        if (this.IsSanTongHuaShun(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.SanTongHuaShun }
        }
        if (this.IsSanFenTianXia(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.SanFenTianXia }
        }
        if (this.IsQuanDa(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.QuanDa }
        }
        if (this.IsQuanXiao(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.QuanXiao }
        }
        if (this.IsCouYiSe(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.ChouYiSe }
        }
        if (this.IsSiTaoSanTiao(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.SiTaoSanTiao }
        }
        if (this.IsWuDuiSanTiao(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.WuDuiSanTiao }
        }
        if (this.IsLiuDuiBan(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.LiuDuiBan }
        }
        if (this.IsSanTongHua(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.SanTongHua }
        }
        if (this.IsSanSunZi(tree)) {
            return { IsSpecial: true, SpecialType: SpecialType.SanSunZi }
        }
        return { IsSpecial: false, SpecialType: SpecialType.None }
    }

    /**
     * 判断一个树是不是“至尊青龙”
     * @param tree 
     */
    private static IsZhiZunQingLong(tree: Tree): boolean {
        return tree.mapScoreListPoker.size == 13 && tree.mapHuaListPoker.size == 1
    }

    /**
     * 是否是"一条龙"
     * @param tree 
     * @returns 
     */
    private static IsYiTiaoLong(tree: Tree): boolean {
        return tree.mapScoreListPoker.size == 13 && tree.mapHuaListPoker.size > 1
    }

    /**
     * 是否是"十二皇族",13张牌中12张牌分值大于等于10
     * @param tree 
     * @returns 
     */
    private static IsShiErHuangZu(tree: Tree): boolean {
        //分少于10的牌的数量
        var lessScoreTCount = 0
        for (const poker of tree.pokers) {
            if (poker.Score < 10) {
                lessScoreTCount++
                if (lessScoreTCount >= 2) {
                    return false
                }
            }
        }
        return true
    }



    /**
     * 是否是"三同花顺"
     * @returns 
     */
    private static IsSanTongHuaShun(tree: Tree): boolean {
        //三同花顺，只可能是3个同样的花，也可能是2个花色，但每个花下都是连续的，一定不是一个花色，因为一个花色就是"至尊青龙"
        if (tree.mapHuaListPoker.size == 1 || tree.mapHuaListPoker.size == 4) {
            return false
        }

        var isSanTongHuaShun = true
        //同一个花下的所有牌，点数是连续的
        tree.mapHuaListPoker.forEach((pokers, _) => {
            if (pokers.length == 3 || pokers.length == 5 || pokers.length == 8 || pokers.length == 10) {
                Util.SortPoker(pokers)
                var last: Poker = null
                for (const poker of pokers) {
                    if (last == null) {
                        last = poker
                    } else {
                        if (poker.Score == last.Score + 1) {
                            last = poker
                        } else {
                            isSanTongHuaShun = false
                        }
                    }
                }
            }
            else {
                isSanTongHuaShun = false
            }
        })

        return isSanTongHuaShun
    }

    /**
    * 是否是"三分天下"
    * @returns 
    */
    private static IsSanFenTianXia(tree: Tree): boolean {
        //有3个铁支就是三分天下
        if (tree.listTieZhi.length != 3) {
            return false
        }
        return true
    }


    /**
    * 是否是"全大"
    * @returns 
    */
    private static IsQuanDa(tree: Tree): boolean {
        var isQuanDa = true
        tree.mapScoreListPoker.forEach((_, socre) => {
            if (socre < 8) {
                isQuanDa = false
            }
        })
        return isQuanDa
    }

    /**
    * 是否是"全小"
    * @returns 
    */
    private static IsQuanXiao(tree: Tree): boolean {
        var isQuanXiao = true
        tree.mapScoreListPoker.forEach((_, socre) => {
            if (socre > 8) {
                isQuanXiao = false
            }
        })
        return isQuanXiao
    }


    /**
    * 是否是"凑一色":即只有一个花色，且花色必需是全红或全黑
    * @returns 
    */
    private static IsCouYiSe(tree: Tree): boolean {
        if (tree.mapHuaListPoker.size != 2) {
            return false
        }
        var isCouYiSe = true
        var lastHua = PokerHua.HuaNone
        tree.mapHuaListPoker.forEach((_, hua) => {
            if (lastHua == PokerHua.HuaNone) {
                lastHua = hua
            } else if (hua - lastHua != 0 && hua - lastHua != 2 && hua - lastHua != -2) {
                isCouYiSe = false
            }
        })
        return isCouYiSe
    }

    /**
    * 是否是“四套三条”,即AAA,BBB,CCC,DDD,E
    * @returns 
    */
    private static IsSiTaoSanTiao(tree: Tree): boolean {
        if (tree.listSanTiao.length == 4) {
            return true
        }
        return false
    }


    /**
    * 是否是“五对三条”,即AA、BB、CC、DD、EE、FFF
    * @returns 是或否
    */
    private static IsWuDuiSanTiao(tree: Tree): boolean {
        if (tree.listDui.length == 5 && tree.listSanTiao.length == 1) {
            return true
        }

        return false
    }

    /**
    * 是否是“六对半”,即AA、BB、CC、DD、EE、FF、G
    * @returns 是或否
    */
    private static IsLiuDuiBan(tree: Tree): boolean {
        if (tree.listDui.length == 6) {
            return true
        }

        return false
    }

    /**
    * 是否是“三同花“
    * @returns 是或否
    */
    private static IsSanTongHua(tree: Tree): boolean {
        //只可能是2种或3种花色，一种花色是同花顺
        if (tree.mapHuaListPoker.size == 4 || tree.mapHuaListPoker.size == 1) {
            return false
        }

        //如果是2种花色，其中一花为8张或10，另一个花为5张或3张；如果是3种花色，同一个花下只能是3张或5张
        var isSanTongHua = true
        tree.mapHuaListPoker.forEach((pokers, _) => {
            var count = pokers.length
            if (count != 3 && count != 5 && count != 8 && count != 10) {
                isSanTongHua = false
            }
        });

        return isSanTongHua
    }

    /**
    * 是否是“三顺子“
    * @returns 是或否
    */
    private static IsSanSunZi(tree: Tree): boolean {
        CalNormal.SplitShunZi(tree)
        for (const node1 of tree.Nodes) {
            if (node1.normalType == NormalType.SHUN_ZI) {
                let middle = new Tree(node1.rest)
                CalNormal.SplitShunZi(middle)
                for (const node2 of middle.Nodes) {
                    if (node2.normalType == NormalType.SHUN_ZI) {
                        let right = node2.rest
                        Util.SortPoker(right)
                        //case 分值连续
                        if (right[0].Score + 1 == right[1].Score && right[1].Score + 1 == right[2].Score) {
                            return true
                        }
                        //case A,2,3 
                        else if (right[0].Point == PokerPoint.Poker2 && right[1].Point == PokerPoint.Poker3 && right[2].Point == PokerPoint.PokerA) {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
}
