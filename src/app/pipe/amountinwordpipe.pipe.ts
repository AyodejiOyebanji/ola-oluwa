import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountinwordpipe'
})
export class AmountinwordpipePipe implements PipeTransform {

  transform(amount: number): string {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const thousands = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];
    const currency = 'naira';
  
    if (amount === 0) {
      return `zero ${currency}`;
    }
  
    let words = '';
  
    if (amount < 0) {
      words += 'minus ';
      amount = Math.abs(amount);
    }
  
    let i = 0;
  
    while (amount > 0) {
      const thousandsAmount = amount % 1000;
  
      if (thousandsAmount !== 0) {
        const hundreds = Math.floor(thousandsAmount / 100);
        const tensAndOnes = thousandsAmount % 100;
        const thousandsWord = thousands[i];
  
        if (hundreds !== 0) {
          words = `${ones[hundreds]} hundred ${words}`;
        }
  
        if (tensAndOnes !== 0) {
          if (tensAndOnes < 10) {
            words = `${ones[tensAndOnes]} ${words}`;
          } else if (tensAndOnes < 20) {
            words = `${teens[tensAndOnes - 10]} ${words}`;
          } else {
            const tensDigit = Math.floor(tensAndOnes / 10);
            const onesDigit = tensAndOnes % 10;
            words = `${tens[tensDigit]} ${ones[onesDigit]} ${words}`;
          }
        }
  
        if (thousandsWord !== '') {
          words = `${thousandsWord} ${words}`;
        }
      }
  
      amount = Math.floor(amount / 1000);
      i++;
    }
  
    return `${words.charAt(0).toUpperCase()}${words.slice(1)}${currency} only`;
  }
  
  }
  
  

  
 

