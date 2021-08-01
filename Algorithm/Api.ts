import { CalNormal, ResultNormal } from "./CalNormal"
import { CalSpecial } from "./CalSpecial"
import { NormalType, SpecialType, Util } from "./Define"
import { Poker } from "./Poker"
import { Tree } from "./Tree"
import { Dui, SanTiao, TreeNode } from "./TreeNode"



export class Api {

    /**
     * 计算该树是否特殊牌型
     * @param tree 牌的结构树
     * @returns 
     */
    public static CalSpecial(tree:Tree): { IsSpecial: boolean, SpecialType: SpecialType } {
        return CalSpecial.CalSpecialResult(tree)
    }

    /**
     * 计算该树的普通牌型
     * @param tree 牌的结构树
     * @returns 
     */
    public static CalNormal(tree:Tree): Array<ResultNormal> {
        var resultList = CalNormal.CalNormalResult(tree)
        var filterResultList = CalNormal.SortFilterResult(resultList)
        return filterResultList
    }

    /**
     * 将牌型转换成树节点（墩）
     * @param pokers 扑克牌
     * @returns 
     */
    public static PokerListToTreeNode(pokers: Array<Poker>): TreeNode {
        var length = pokers.length
        switch (length) {
            case 5:
                var tree = new Tree(pokers)
                CalNormal.Split(tree)
                return tree.Nodes[0]
            case 3:
                var n = new TreeNode()
                n.pokers = pokers
                if (pokers[0].Score == pokers[1].Score && pokers[1].Score == pokers[2].Score) {
                    n.normalType = NormalType.SAN_TIAO
                    n.sanTiao = new SanTiao()
                    n.sanTiao.SanTiaoScore = pokers[0].Score
                } else if (pokers[0].Score == pokers[1].Score) {
                    n.normalType = NormalType.DUI_ZI
                    n.dui = new Dui()
                    n.dui.DuiScore = pokers[1].Score
                    n.dui.Dan3Score = pokers[2].Score
                } else if (pokers[0].Score == pokers[2].Score) {
                    n.normalType = NormalType.DUI_ZI
                    n.dui = new Dui()
                    n.dui.DuiScore = pokers[0].Score
                    n.dui.Dan3Score = pokers[1].Score
                } else if (pokers[1].Score == pokers[2].Score) {
                    n.normalType = NormalType.DUI_ZI
                    n.dui = new Dui()
                    n.dui.DuiScore = pokers[1].Score
                    n.dui.Dan3Score = pokers[0].Score
                } else {
                    n.normalType = NormalType.WU_LONG
                }
                return n
            default:
                return null
        }
    }


    /**
     * 将ASCII型的扑克id转成扑克数据结构
     * @param nums 
     * @returns 
     */
    public static PokersFromAscii(nums: Array<number>): Array<Poker> {
        var target = new Array<Poker>()
        for (const num of nums) {
            var hua = (num >> 4) + 1
            var point = num & 0x0F;
            var poker = new Poker(point, hua)
            target.push(poker)
        }
        return target
    }
}

