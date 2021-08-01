import { Api } from "./Api";
import { CalNormal } from "./CalNormal";
import { CalSpecial } from "./CalSpecial";
import { SpecialType, Util } from "./Define";
import { Poker } from "./Poker";
import { Tree } from "./Tree";

export class Api_Example {

    private static TestCase = [
        {
            "Pokers": "♦A,♦2,♦3,♦4,♦5,♦6,♦7,♦8,♦9,♦T,♦J,♦Q,♦K",
            "Desc": "青龙测试",
            "IsTest": false
        },
        {
            "Pokers": "♣A,♦2,♦3,♦4,♦5,♦6,♦7,♦8,♦9,♦T,♦J,♦Q,♦K",
            "Desc": "一条龙",
            "IsTest": false
        },
        {
            "Pokers": "♠A,♦T,♣T,♥T,♦J,♣J,♥J,♦Q,♣Q,♥Q,♦K,♣K,♥K",
            "Desc": "十二皇族",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♦3,♦4,♥3,♥4,♥5,♥6,♥7,♣T,♣J,♣Q,♣K,♣A",
            "Desc": "三同花顺",
            "IsTest": false
        },
        {
            "Pokers": "♦3,♣3,♥3,♠3,♦5,♣5,♥5,♠5,♦7,♣7,♥7,♠7,♦9",
            "Desc": "三分天下",
            "IsTest": false
        },
        {
            "Pokers": "♦8,♣9,♥T,♠Q,♦K,♣8,♥9,♠A,♦A,♣T,♥T,♠K,♦Q",
            "Desc": "全大",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♣3,♥4,♠5,♦6,♣7,♥2,♠3,♦4,♣5,♥6,♠7,♦8",
            "Desc": "全小",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♦3,♦5,♦6,♦7,♦T,♦K,♥2,♥6,♥9,♥A,♥T,♥J",
            "Desc": "凑一色",
            "IsTest": false
        },
        {
            "Pokers": "♦3,♣3,♥3,♦5,♣5,♥5,♦7,♥7,♠7,♦9,♣9,♥9,♠T",
            "Desc": "四套三条",
            "IsTest": false
        },
        {
            "Pokers": "♦3,♣3,♦4,♣4,♦6,♣6,♦7,♣7,♦9,♣9,♦T,♣T,♥T",
            "Desc": "五对三条",
            "IsTest": false
        },
        {
            "Pokers": "♦3,♣3,♦4,♣4,♦6,♣6,♦7,♣7,♦9,♣9,♦T,♣T,♥K",
            "Desc": "六对半",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♦5,♦6,♥3,♥4,♥K,♥A,♥7,♣T,♣2,♣7,♣K,♣A",
            "Desc": "三同花",
            "IsTest": false
        },
        {
            "Pokers": "♠2,♣3,♦4,♥3,♥4,♥5,♣6,♥7,♣T,♣J,♣Q,♦K,♣A",
            "Desc": "三顺子1：最简单的顺子情况",
            "IsTest": false
        },
        {
            "Pokers": "♠J,♥Q,♦K,♥3,♥4,♥5,♣6,♥7,♣3,♣4,♥5,♥6,♦7",
            "Desc": "三顺子2：两叠顺子情况",
            "IsTest": false
        },
        {
            "Pokers": "♠J,♥Q,♦K,♥3,♥4,♥5,♣6,♥7,♣A,♣2,♥3,♥4,♦5",
            "Desc": "三顺子3：A2345的情况",
            "IsTest": false
        },
        {
            "Pokers": "♠A,♥2,♦3,♥3,♥4,♥5,♣6,♥7,♣A,♣2,♥3,♥4,♦5",
            "Desc": "三顺子4：头部为A23也是三顺子",
            "IsTest": false
        },
        {
            "Pokers": "♦3,♣3,♥3,♠3,♦5,♣5,♥5,♠5,♦4,♣6,♥7,♠8,♦9",
            "Desc": "普通牌型【2铁支+5单】",
            "IsTest": false
        },
        {
            "Pokers": "♦3,♣3,♥3,♠3,♦5,♣5,♥5,♠5,♥4,♥6,♥7,♥8,♦9",
            "Desc": "普通牌型【2铁支+5单（可凑同花顺）】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♦2,♦3,♦4,♦5,♥4,♠5,♥6,♥7,♥8,♥9,♥T,♦K",
            "Desc": "普通牌型【两同花顺1】",
            "IsTest": true
        },
        {
            "Pokers": "♦A,♦2,♦3,♦4,♦5,♦6,♦7,♥9,♥T,♥J,♥Q,♥K,♣K",
            "Desc": "普通牌型【两同花顺2】",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♣2,♥2,♠3,♦3,♣3,♦7,♣7,♥J,♠T,♥K,♠A,♦A",
            "Desc": "普通牌型【葫芦+葫芦+3单】",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♣2,♥2,♠3,♦3,♣3,♦7,♣7,♥J,♠T,♥K,♠A,♦5",
            "Desc": "普通牌型【葫芦+三条+5单】",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♣2,♥2,♠2,♦3,♣5,♦7,♣8,♥9,♠K,♥J,♠Q,♦A",
            "Desc": "普通牌型【四条和+9单】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♣A,♥Q,♠Q,♦3,♣3,♦7,♣8,♥9,♠K,♥J,♠5,♦4",
            "Desc": "普通牌型【3对+7单】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♣A,♥Q,♠Q,♦Q,♣3,♦3,♣4,♥5,♠7,♥6,♠9,♦J",
            "Desc": "普通牌型【三条+对+顺子+3单】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♣A,♥Q,♠Q,♦8,♣3,♦3,♣4,♥4,♠7,♥7,♠9,♠J",
            "Desc": "普通牌型【5对+3单】",
            "IsTest": false
        },
        {
            "Pokers": "♦2,♣2,♥3,♠3,♦5,♣5,♥7,♠7,♥J,♥T,♥K,♥A,♦A",
            "Desc": "普通牌型【5对+3单（可凑同花）】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♣A,♥Q,♠Q,♣3,♦3,♣4,♥4,♠5,♥6,♥7,♠8,♠9",
            "Desc": "普通牌型【4对+顺子(需要拆对)】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♣A,♥Q,♠Q,♣3,♦3,♣4,♥4,♠5,♥6,♥J,♠8,♠9",
            "Desc": "普通牌型【4对+5单】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♣A,♥Q,♠Q,♣3,♦3,♣4,♥4,♥5,♥6,♥J,♥8,♥9",
            "Desc": "普通牌型【4对+5同花】",
            "IsTest": false
        },
        {
            "Pokers": "♦A,♦2,♦3,♦4,♦6,♦7,♦8,♦9,♦Q,♣6,♣J,♣8,♣9",
            "Desc": "普通牌型【3对，A同花】",
            "IsTest": true
        },

    ]

    public static PokerDunCal = [
        {
            "Pokers": "♦4,♦6,♦7,♦8,♦9",
            "Desc": "同花判定",
            "IsTest": false
        },
        {
            "Pokers": "♦5,♦6,♦7,♦8,♦9",
            "Desc": "同花顺判定",
            "IsTest": false
        },
        {
            "Pokers": "♦5,♣7,♦7,♣8,♦8",
            "Desc": "同花顺判定",
            "IsTest": false
        },
        {
            "Pokers": "♦5,♣7,♦7",
            "Desc": "同花顺判定",
            "IsTest": false
        },
        {
            "Pokers": "♠7,♣7,♦7",
            "Desc": "同花顺判定",
            "IsTest": false
        }
    ]


    /**
     * 上面的json配置的牌型的测试案例
     */
    public static TestExample() {
        for (const example of this.TestCase) {
            if (example.IsTest) {
                var pokers = this.DecodePokers(example.Pokers)
                console.log(`测试开始：${example.Pokers},Desc=${example.Desc}`);
                var startTime = (new Date()).valueOf()

                //具体参考该方法
                this.Api_Calaulate_Func_Example(pokers)

                var endTime = (new Date()).valueOf()
                var costTime = endTime - startTime
                console.log(`测试结束,耗时：${costTime}毫秒`);
                console.log(`--------------------------------------------`);
            }
        }
    }

    /**
     * 使用api计算牌型方法示例
     * @param pokers 
     * @returns 
     */
    public static Api_Calaulate_Func_Example(pokers: Array<Poker>) {
        var tree = new Tree(pokers)
        var specialResult = Api.CalSpecial(tree)
        if (specialResult.IsSpecial) {
            var paiXinag = Util.SpecialTypeToString(specialResult.SpecialType)
            console.log(`该牌型为特殊牌型：${paiXinag}`)
            return
        }

        var resultList = Api.CalNormal(tree)
        for (let index = 0; index < resultList.length; index++) {
            const result = resultList[index];
            var resultStr = result.ToString()
            console.log(`牌型[${index}]=> ${resultStr}`)
        }
    }


    /**
     * 将json表中的牌转换成poker的list
     * @param testPokerStr 
     * @returns 
     */
    private static DecodePokers(testPokerStr: string): Array<Poker> {
        var testPokers = new Array<Poker>()
        var pokerStrList = testPokerStr.split(",")
        for (const pokerStr of pokerStrList) {
            var huaDesc = pokerStr[0]
            var hua = Util.StringToPokerHua(huaDesc)
            var pointDesc = pokerStr[1]
            var point = Util.StringToPokerPoint(pointDesc)
            var poker = new Poker(point, hua)
            testPokers.push(poker)
        }
        return testPokers
    }

    /**
     * 测试十六进制转poker类型
     */
    public static TestPokerFromAscii() {
        var nums = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D]
        var pokers = Api.PokersFromAscii(nums)
        var desc = ""
        for (const poker of pokers) {
            desc += poker.Desc
        }
        console.log(desc)
    }
}

console.log("TestExample")
Api_Example.TestExample()
console.log("----------------------------------------------------")
console.log("TestPokerFromAscii")
Api_Example.TestPokerFromAscii()

