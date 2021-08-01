import { PokerHua, Util } from "./Define"
import { Poker } from "./Poker"
import { TreeNode } from "./TreeNode"


export class Tree {
    public pokers: Array<Poker>                                 //树的牌
    public mapScoreListPoker: Map<number, Array<Poker>>        //按点分组
    public mapHuaListPoker: Map<PokerHua, Array<Poker>>        //按花分组
    public listShunZi: Array<Array<number>>                    //顺子
    public listTieZhi: Array<number>                          //铁支 int为铁支的分值
    public listSanTiao: Array<number>                         //三条 int为三条的分值
    public listDui: Array<number>                             //对子 int为对子的分值
    public listDanPai: Array<number>                          //单牌 int为单牌的分值
    public Nodes: Array<TreeNode>                              //二叉树拆出来的节点

    constructor(pokers: Array<Poker>) {
        this.pokers = pokers
        Util.SortPoker(this.pokers);
        this.mapScoreListPoker = new Map<number, Array<Poker>>();
        this.mapHuaListPoker = new Map<PokerHua, Array<Poker>>();
        this.listShunZi = new Array<Array<number>>();
        this.listTieZhi = new Array<number>();
        this.listSanTiao = new Array<number>();
        this.listDui = new Array<number>();
        this.listDanPai = new Array<number>();
        this.Nodes = new Array<TreeNode>()

        this.statistic()
    }

    private statistic() {
        this.statisticsHuaOrScore()
        this.statisticsSunZi()
        this.statistics1234()
    }

    /**
     * 分组:按花分组或按大小分组
     */
    private statisticsHuaOrScore() {
        this.pokers.forEach(poker => {
            var sameScorePokers = this.mapScoreListPoker.get(poker.Score)
            if (sameScorePokers == null) {
                sameScorePokers = new Array<Poker>()
            }
            sameScorePokers.push(poker)
            this.mapScoreListPoker.set(poker.Score, sameScorePokers)

            var sameHuaPokers = this.mapHuaListPoker.get(poker.Hua)
            if (sameHuaPokers == null) {
                sameHuaPokers = new Array<Poker>()
            }
            sameHuaPokers.push(poker)
            this.mapHuaListPoker.set(poker.Hua, sameHuaPokers)
        })
    }


    /**
     * 统计顺子，从顺a到顺b
     */
    private statisticsSunZi() {
        var _tempStart: number = 0
        var _tempEnd: number = 0
        var _tempCount: number = 0
        for (let score = 2; score <= 14; score++) {
            if (this.mapScoreListPoker.has(score)) {
                if (_tempStart == 0) {
                    _tempStart = score //从哪开始连接，比如从2分开始连续
                    _tempCount = 1     //共连续的长度
                }
                else {
                    _tempCount = _tempCount + 1
                }
                if (_tempCount >= 5) {
                    _tempEnd = score
                    this.listShunZi.push(new Array<number>(_tempEnd - 4, _tempEnd))
                }
            } else {
                _tempStart = 0
                _tempCount = 1
            }
        }

        var isHaveSpecialSunZi = () => {
            var specialShunZiSocre = [14, 2, 3, 4, 5]
            for (const score of specialShunZiSocre) {
                if (!this.mapScoreListPoker.has(score)) {
                    return false
                }
            }
            return true
        }

        if (isHaveSpecialSunZi()) {
            this.listShunZi.push([2, 14])
        }

    }


    /**
     * 统计单牌，对子，三条，铁支
     */
    private statistics1234() {

        //是否是单牌：虽然是单张的，但即不在顺子里，也不在同花里，则为单牌
        var isDanPai = (poker: Poker): boolean => {

            //如果顺子里不包括该张牌，就是单牌
            for (const shunZi of this.listShunZi) {
                if ((poker.Score >= shunZi[0] && poker.Score <= shunZi[0] + 3)) {
                    return false
                } else if (poker.Score == shunZi[1]) {
                    return false
                }
            }

            var isInTongHua = true
            //如果同花列表里有这张牌，就
            this.mapHuaListPoker.forEach((pokers, _) => {
                if (pokers.length >= 5) {
                    for (const p of pokers) {
                        if (p == poker) {
                            isInTongHua = false
                        }
                    }
                }
            })
            return isInTongHua
        }

        this.mapScoreListPoker.forEach((pokers: Array<Poker>, score: number,) => {
            var count = pokers.length
            switch (count) {
                case 1:
                    if (isDanPai(pokers[0])) {
                        this.listDanPai.push(score)
                    }
                    break;
                case 2:
                    this.listDui.push(score)
                    break;
                case 3:
                    this.listSanTiao.push(score)
                    break;
                case 4:
                    this.listTieZhi.push(score)
                    break;
            }
        })

        this.listDanPai.sort((a, b) => { return a - b })
        this.listDui.sort((a, b) => { return a - b })
        this.listSanTiao.sort((a, b) => { return a - b })
        this.listTieZhi.sort((a, b) => { return a - b })
    }
}
