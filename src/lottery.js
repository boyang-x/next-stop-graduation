// All odds are game settings, including the ten-million prize in EVERY denomination.
export const LOTTERY_TICKETS = [
  ['pocket','口袋小惊喜',10,.55,.25,1/20000,.0001,.0005],
  ['small','校园小幸运',20,.60,.30,1/10000,.0002,.001],
  ['weekend','周末好彩头',50,.65,.35,1/4000,.0005,.002],
  ['festival','假日好时光',100,.70,.40,1/2000,.001,.004],
  ['graduate','毕业鸿运',500,.75,.45,1/400,.003,.008],
  ['grand','人生大惊喜',1000,.80,.50,1/100,.006,.012],
].map(([id,name,price,win,profit,jackpot,million,hundredThousand])=>{
  const prizes=[[10000000,jackpot],[1000000,million],[100000,hundredThousand],[price*20,.01],[price*8,.025],[price*3,.055],[price*2,profit-.09-jackpot-million-hundredThousand],[price,win-profit-.10],[price/2,.10],[0,1-win]];
  return {id,name,price,prizes,gameSetting:true};
});
export function ticketOf(id='weekend'){return LOTTERY_TICKETS.find(t=>t.id===id);}
export function drawPrize(id,roll){const t=ticketOf(id);if(!t||!Number.isFinite(roll)||roll<0||roll>=1)throw new Error('Invalid lottery draw');let bound=0;for(const [amount,p] of t.prizes){bound+=p;if(roll<bound)return amount;}return 0;}
export function lotteryStats(t){return {winChance:t.prizes.filter(([a])=>a>0).reduce((s,[,p])=>s+p,0),profitChance:t.prizes.filter(([a])=>a>t.price).reduce((s,[,p])=>s+p,0),returnRatio:t.prizes.reduce((s,[a,p])=>s+a*p,0)/t.price,jackpotChance:t.prizes.find(([a])=>a===10000000)[1]};}
