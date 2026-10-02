// All odds are game settings, including the ten-million prize in EVERY denomination.
export const LOTTERY_TICKETS = [
  ['pocket','口袋小惊喜',10,.40,.15,1/100000],
  ['small','校园小幸运',20,.44,.18,1/50000],
  ['weekend','周末好彩头',50,.48,.21,1/20000],
  ['festival','假日好时光',100,.52,.24,1/10000],
  ['graduate','毕业鸿运',500,.56,.27,1/2000],
  ['grand','人生大惊喜',1000,.60,.30,1/500],
].map(([id,name,price,win,profit,jackpot])=>{
  const prizes=[[10000000,jackpot],[price*20,.002],[price*8,.008],[price*3,.03],[price*2,profit-.04-jackpot],[price,win-profit-.10],[price/2,.10],[0,1-win]];
  return {id,name,price,prizes,gameSetting:true};
});
export function ticketOf(id='weekend'){return LOTTERY_TICKETS.find(t=>t.id===id);}
export function drawPrize(id,roll){const t=ticketOf(id);if(!t||!Number.isFinite(roll)||roll<0||roll>=1)throw new Error('Invalid lottery draw');let bound=0;for(const [amount,p] of t.prizes){bound+=p;if(roll<bound)return amount;}return 0;}
export function lotteryStats(t){return {winChance:t.prizes.filter(([a])=>a>0).reduce((s,[,p])=>s+p,0),profitChance:t.prizes.filter(([a])=>a>t.price).reduce((s,[,p])=>s+p,0),returnRatio:t.prizes.reduce((s,[a,p])=>s+a*p,0)/t.price,jackpotChance:t.prizes.find(([a])=>a===10000000)[1]};}
