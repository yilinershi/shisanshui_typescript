import { Api } from "./Api";
import { CompareResult, NormalType, Util } from "./Define";
import { Tree } from "./Tree";
import { Dui, HuLu, LiangDui, SanTiao, TieZhi, TreeNode } from "./TreeNode";

export class ResultNormal {

    public BestScore: number;
    public Head: TreeNode;
    public Middle: TreeNode;
    public Tail: TreeNode;

    public ToString(): string {
        var leftPokerDesc = ""
        for (const poker of this.Head.pokers) {
            leftPokerDesc += poker.Desc
        }
        var middlePokerDesc = ""
        for (const poker of this.Middle.pokers) {
            middlePokerDesc += poker.Desc
        }
        var rightPokerDesc = ""
        for (const poker of this.Tail.pokers) {
            rightPokerDesc += poker.Desc
        }

        return `结果：{上:【${Util.NormalTypeToString(this.Tail.normalType)}】= {${rightPokerDesc}},中:【${Util.NormalTypeToString(this.Middle.normalType)}】= {${middlePokerDesc}},下:【${Util.NormalTypeToString(this.Head.normalType)}】= {${leftPokerDesc}},好牌值=【${this.BestScore}】}`
    }
}

export class CalNormal {

    /**
     * 列出所有的普通牌型
     * @param fatherTree 
     * @returns 
     */
    public static CalNormalResult(fatherTree: Tree): Array<ResultNormal> {
        var resultList = new Array<ResultNormal>()
        this.Split(fatherTree)
        for (const node1 of fatherTree.Nodes) {

            // console.log("下墩节点 = " + node1.ToString())
            var sonTree = new Tree(node1.rest)
            this.Split(sonTree)
            for (const node2 of sonTree.Nodes) {
                // console.log("中墩节点 = " + node2.ToString())
                if (node1.CompareExternal(node2) != CompareResult.Worse) {
                    var node3 = Api.PokerListToTreeNode(node2.rest)
                    if (node2.CompareExternal(node3) != CompareResult.Worse) {
                        // console.log("上墩节点 = " + node3.ToString())
                        var bestScore = 0
                        switch (node1.normalType) {
                            case NormalType.TONG_HUA_SHUN:
                                bestScore += 5 + node1.normalType
                                break
                            case NormalType.TIE_ZHI:
                                bestScore += 4 + node1.normalType
                                break
                            default:
                                bestScore += 1 + node1.normalType
                                break
                        }

                        switch (node2.normalType) {
                            case NormalType.TONG_HUA_SHUN:
                                bestScore += 10 + node2.normalType
                                break
                            case NormalType.TIE_ZHI:
                                bestScore += 8 + node2.normalType
                                break
                            case NormalType.HU_LU:
                                bestScore += 2 + node2.normalType
                                break
                            default:
                                bestScore += 1 + node2.normalType
                                break
                        }

                        switch (node3.normalType) {
                            case NormalType.SAN_TIAO:
                                bestScore += 3 + node3.normalType
                                break
                            case NormalType.DUI_ZI:
                                bestScore += 2 + node3.normalType
                                break
                            default:
                                bestScore += 1 + node3.normalType
                                break
                        }

                        var result = new ResultNormal()
                        result.BestScore = bestScore
                        result.Head = node1
                        result.Middle = node2
                        result.Tail = node3
                        resultList.push(result)
                    }
                }
            }
        }

        return resultList
    }


    public static SortFilterResult(resultList: Array<ResultNormal>): Array<ResultNormal> {
        resultList.sort((a, b) => {

            if (a.BestScore != b.BestScore) {
                return b.BestScore - a.BestScore
            }

            if (a.Head.CompareExternal(b.Head) != CompareResult.Better) {
                return 1
            }
            if (a.Head.CompareExternal(b.Head) == CompareResult.Worse) {
                return -1
            }
            if (a.Tail.CompareExternal(b.Tail) == CompareResult.Better) {
                return 1
            }
            if (a.Tail.CompareExternal(b.Tail) == CompareResult.Worse) {
                return -1
            }
            if (a.Middle.CompareExternal(b.Middle) == CompareResult.Better) {
                return 1
            }
            if (a.Middle.CompareExternal(b.Middle) == CompareResult.Worse) {
                return -1
            }
            return 0
        })

        var filterRes = new Array<ResultNormal>()
        var last: ResultNormal = null
        for (const result of resultList) {
            if (last == null) {
                last = result
                filterRes.push(last)
            } else if (result.Head.normalType != last.Head.normalType || result.Middle.normalType != last.Middle.normalType || result.Tail.normalType != last.Tail.normalType) {
                last = result
                filterRes.push(result)
            }
        }
        return filterRes
    }


    /**
     * 将树拆出各种节点出来
     * @param tree 
     */
    public static Split(tree: Tree) {
        this.SplitTongHuaSun(tree)
        this.SplitTieZhi(tree)
        this.SplitHuLu(tree)
        this.SplitTongHua(tree)
        this.SplitShunZi(tree)
        this.SplitSanTiao(tree)
        this.SplitLiangDui(tree)
        this.SplitDui(tree)
        this.SplitWuLong(tree)
    }

    /**
     * 将树中拆出一个同花顺节点出来
     * @param tree 要拆开的树
     */
    private static SplitTongHuaSun(tree: Tree) {
        var count = tree.listShunZi.length
        if (count <= 0) {
            return
        }

        tree.listShunZi.forEach(shunZi => {
            var poker1s = tree.mapScoreListPoker.get(shunZi[0])
            var poker2s = tree.mapScoreListPoker.get(shunZi[0] + 1)
            var poker3s = tree.mapScoreListPoker.get(shunZi[0] + 2)
            var poker4s = tree.mapScoreListPoker.get(shunZi[0] + 3)
            var poker5s = tree.mapScoreListPoker.get(shunZi[1])
            for (let i1 = 0; i1 < poker1s.length; i1++) {
                var hua = poker1s[i1].Hua
                for (let i2 = 0; i2 < poker2s.length; i2++) {
                    if (poker2s[i2].Hua == hua) {
                        for (let i3 = 0; i3 < poker3s.length; i3++) {
                            if (poker3s[i3].Hua == hua) {
                                for (let i4 = 0; i4 < poker4s.length; i4++) {
                                    if (poker4s[i4].Hua == hua) {
                                        for (let i5 = 0; i5 < poker5s.length; i5++) {
                                            if (poker5s[i5].Hua == hua) {
                                                var n = new TreeNode()
                                                n.normalType = NormalType.TONG_HUA_SHUN
                                                for (const poker of tree.pokers) {
                                                    if (poker == poker1s[i1] || poker == poker2s[i2] || poker == poker3s[i3] || poker == poker4s[i4] || poker == poker5s[i5]) {
                                                        n.pokers.push(poker)
                                                    } else {
                                                        n.rest.push(poker)
                                                    }
                                                }
                                                tree.Nodes.push(n)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * 从树中拆出一个铁支节点出来
     * @param tree 要拆的树
     * @returns 
     */
    private static SplitTieZhi(tree: Tree) {
        var count = tree.listTieZhi.length
        if (count <= 0) {
            return
        }
        var maxTieZhiScore = tree.listTieZhi[count - 1]


        for (const poker1 of tree.pokers) {
            if (poker1.Score != maxTieZhiScore) {
                var n = new TreeNode()
                n.normalType = NormalType.TIE_ZHI
                n.pokers.push(poker1)
                n.tieZhi = new TieZhi()
                n.tieZhi.TieZhiScore = maxTieZhiScore
                n.tieZhi.DanScore = poker1.Score

                for (const poker2 of tree.pokers) {
                    if (poker2 != poker1) {
                        if (poker2.Score == maxTieZhiScore) {
                            n.pokers.push(poker2)
                        }
                        else {
                            n.rest.push(poker2)
                        }
                    }
                }
                tree.Nodes.push(n)
            }
        }
    }


    /**
     * 拆分出葫芦
     * @param tree 要拆的树
     * @returns 
     */
    private static SplitHuLu(tree: Tree) {
        var countDui: number = tree.listDui.length
        var countSanTiao: number = tree.listSanTiao.length
        if (countDui < 1 || countSanTiao <= 0) {
            return
        }

        var huLuScore = tree.listSanTiao[countSanTiao - 1] //取最大的三条

        for (const duiScore of tree.listDui) {
            var n = new TreeNode()
            n.normalType = NormalType.HU_LU
            n.huLu = new HuLu()
            n.huLu.HuLuScore = huLuScore

            for (const poker of tree.pokers) {
                if (poker.Score == huLuScore || poker.Score == duiScore) {
                    n.pokers.push(poker)
                } else {
                    n.rest.push(poker)
                }
            }

            tree.Nodes.push(n)
        }
    }

    /**
     * 将所有的同花组合拆出来
     * @param tree 要拆的树
     */
    private static SplitTongHua(tree: Tree) {
        tree.mapHuaListPoker.forEach((pokers, _) => {
            var count = pokers.length
            if (count >= 5) {
                for (let i1 = 0; i1 < count; i1++) {
                    for (let i2 = i1 + 1; i2 < count; i2++) {
                        for (let i3 = i2 + 1; i3 < count; i3++) {
                            for (let i4 = i3 + 1; i4 < count; i4++) {
                                for (let i5 = i4 + 1; i5 < count; i5++) {
                                    var n = new TreeNode()
                                    n.normalType = NormalType.TONG_HUA
                                    for (const poker of tree.pokers) {
                                        if (poker == pokers[i1] || poker == pokers[i2] || poker == pokers[i3] || poker == pokers[i4] || poker == pokers[i5]) {
                                            n.pokers.push(poker)
                                        }
                                        else {
                                            n.rest.push(poker)
                                        }
                                    }
                                    tree.Nodes.push(n)
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    /**
     * 将所有的顺子拆出来
     * @param tree 要拆的树
     */
    public static SplitShunZi(tree: Tree) {
        var count: number = tree.listShunZi.length
        if (count <= 0) {
            return
        }

        tree.listShunZi.forEach(shunZi => {
            var poker1s = tree.mapScoreListPoker.get(shunZi[0])
            var poker2s = tree.mapScoreListPoker.get(shunZi[0] + 1)
            var poker3s = tree.mapScoreListPoker.get(shunZi[0] + 2)
            var poker4s = tree.mapScoreListPoker.get(shunZi[0] + 3)
            var poker5s = tree.mapScoreListPoker.get(shunZi[1])
            for (let i1 = 0; i1 < poker1s.length; i1++) {
                for (let i2 = 0; i2 < poker2s.length; i2++) {
                    for (let i3 = 0; i3 < poker3s.length; i3++) {
                        for (let i4 = 0; i4 < poker4s.length; i4++) {
                            for (let i5 = 0; i5 < poker5s.length; i5++) {
                                var n = new TreeNode()
                                n.normalType = NormalType.SHUN_ZI
                                for (const poker of tree.pokers) {
                                    if (poker == poker1s[i1] || poker == poker2s[i2] || poker == poker3s[i3] || poker == poker4s[i4] || poker == poker5s[i5]) {
                                        n.pokers.push(poker)
                                    } else {
                                        n.rest.push(poker)
                                    }
                                }
                                tree.Nodes.push(n)
                            }
                        }
                    }
                }
            }
        });
    }

    /**
    * 将所有的三条拆出来
    * @param tree 要拆的树
    */
    private static SplitSanTiao(tree: Tree) {
        var sanTiaoCount = tree.listSanTiao.length
        var danPaiCount = tree.listDanPai.length
        if (sanTiaoCount <= 0 || danPaiCount < 2) {
            return
        }

        var maxSanTiaoScore = tree.listSanTiao[sanTiaoCount - 1] //最大的三条分数
        var smallDanPaiScore = tree.listDanPai[0]              //最小的单牌
        var bigDanPaiScore = tree.listDanPai[1]                //第二小的单牌

        var n = new TreeNode()
        n.normalType = NormalType.SAN_TIAO
        n.sanTiao = new SanTiao()
        n.sanTiao.SanTiaoScore = maxSanTiaoScore
        n.sanTiao.Dan1Score = bigDanPaiScore
        n.sanTiao.Dan2Score = smallDanPaiScore


        for (const poker of tree.pokers) {
            if (poker.Score == smallDanPaiScore || poker.Score == bigDanPaiScore || poker.Score == maxSanTiaoScore) {
                n.pokers.push(poker)

            } else {
                n.rest.push(poker)
            }
        }
        tree.Nodes.push(n)
    }

    /**
     * 拆分出两对出来
     * @param tree 
     * @returns 
     */
    private static SplitLiangDui(tree: Tree) {
        var danPaiCount = tree.listDanPai.length
        var duiCount = tree.listDui.length
        if (duiCount < 2) {
            return
        }
        var danPaiScore = 0
        var dui1Score = 0
        var dui2Score = 0

        if (duiCount == 2 || duiCount == 3) {
            //2对或3对没有单牌时，说明其它3张能和对里凑出最起码是同花或是顺子，因为顺子和同花比较大，完全可以不考虑二对
            if (danPaiCount == 0) {
                return
            }
            dui1Score = tree.listDui[0]
            dui2Score = tree.listDui[1]
            danPaiScore = tree.listDanPai[0]
        } else if (duiCount == 4) {
            if (danPaiCount == 0) {
                dui1Score = tree.listDui[2]
                dui2Score = tree.listDui[1]
                danPaiScore = tree.listDui[0]
            }
            else {
                dui1Score = tree.listDui[1]
                dui2Score = tree.listDui[0]
                danPaiScore = tree.listDanPai[0]
            }
        } else if (duiCount == 5) {
            //2对或3对没有单牌时，说明其它3张能和对里凑出最起码是同花或是顺子，因为顺子和同花比较大，完全可以不考虑二对
            if (danPaiCount == 0) {
                return
            } else {
                dui1Score = tree.listDui[3]
                dui2Score = tree.listDui[0]
                danPaiScore = tree.listDanPai[0]
            }
        }

        var n = new TreeNode()
        n.normalType = NormalType.LIANG_DUI
        n.liangDui = new LiangDui()
        n.liangDui.Dui1Score = dui1Score
        n.liangDui.Dui2Score = dui2Score
        n.liangDui.DanScore = danPaiScore

        //单牌是拆出来的话，要防止单牌重复加入
        var isAddDanPai = false
        for (const poker of tree.pokers) {
            if (poker.Score == dui1Score || poker.Score == dui2Score) {
                n.pokers.push(poker)
            }
            else if (poker.Score == danPaiScore && isAddDanPai == false) {
                n.pokers.push(poker)
                isAddDanPai = true
            }
            else {
                n.rest.push(poker)
            }
        }
        tree.Nodes.push(n)
    }


    /**
     * 从树中拆出一对来
     * @param tree 
     */
    private static SplitDui(tree: Tree) {
        var duiCount = tree.listDui.length
        var danPaiCount = tree.listDanPai.length
        if ((duiCount == 1 && danPaiCount >= 3) || (duiCount == 2 && danPaiCount >= 3) || (duiCount == 3 && danPaiCount >= 3)) {

            var duiScore = 0
            if (duiCount == 1) {
                duiScore = tree.listDui[0]
            } else if (duiCount == 2) { //有两对时，取大的对
                duiScore = tree.listDui[1]
            } else if (duiCount == 3) {
                duiScore = tree.listDui[2]
            }

            var dan1Score = tree.listDanPai[0]
            var dan2Score = tree.listDanPai[1]
            var dan3Score = tree.listDanPai[2]

            var n = new TreeNode()
            n.normalType = NormalType.DUI_ZI
            n.dui = new Dui()
            n.dui.DuiScore = duiScore
            n.dui.Dan1Score = dan1Score
            n.dui.Dan2Score = dan2Score
            n.dui.Dan3Score = dan3Score

            for (const poker of tree.pokers) {
                if (poker.Score == duiScore || poker.Score == dan1Score || poker.Score == dan2Score || poker.Score == dan3Score) {
                    n.pokers.push(poker)

                } else {
                    n.rest.push(poker)
                }
            }
            tree.Nodes.push(n)

        }
    }


    /**
    * 从树中拆出一对来
    * @param tree 
    */
    private static SplitWuLong(tree: Tree) {
        var duiCount = tree.listDui.length
        var danPaiCount = tree.listDanPai.length
        if (duiCount > 0 || danPaiCount < 5) {
            return
        }
        var dan1Score = tree.listDanPai[danPaiCount - 1] //最大的单牌
        var dan2Score = tree.listDanPai[0]             //第1小的单牌
        var dan3Score = tree.listDanPai[1]             //第2小的单牌
        var dan4Score = tree.listDanPai[2]             //第3小的单牌
        var dan5Score = tree.listDanPai[3]             //第4小的单牌
        var n = new TreeNode()
        n.normalType = NormalType.WU_LONG
        for (const poker of tree.pokers) {
            if (poker.Score == dan1Score || poker.Score == dan2Score || poker.Score == dan3Score || poker.Score == dan4Score || poker.Score == dan5Score) {
                n.pokers.push(poker)

            } else {
                n.rest.push(poker)
            }
        }
        tree.Nodes.push(n)
    }
}

