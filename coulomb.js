// クーロン力を取り扱うクラス
class coulomb {
  constructor() {
    this.charges = [];
    this.vv = 100000; // クーロン力の描画を行う際のスケール（大きいほど描画上のクーロン力が小さくなる）
  }
  // 点電荷を登録するメソッド
  add( charge ) {
    this.charges.push( charge );
  }
  // クーロン力を計算するメソッド
  // 返り値は配列の配列になっている
  // 外側の配列は，それぞれの点電荷
  // 内側の配列は，描画のための始点x,yと終点x,y
  calc() {
    let forces = [];
    let num1 = 0;
    for( let loop of this.charges ) {
      let x = 0, y = 0;
      let num2 = 0;
      for( let c of this.charges) {
        if( loop != c ) {
          console.log( "num1=" + num1 + ", num2=" + num2 );
          let answer = this.get_xy( loop, c );
          x += answer[0];
          y += answer[1];
        }
        num2++;
      }
      forces.push( [loop.x, loop.y, loop.x + x, loop.y + y] );
      num1++;
    }
    return forces;
  }
  // 個別（一対一）のクーロン力を計算するメソッド
  calc_coulomb( a, b ) {
    var k = 9.0 * Math.pow( 10.0, 9.0 );
    var len_x = a.x - b.x;
    var len_y = a.y - b.y;
    var r2 = Math.pow( len_x, 2.0 ) + Math.pow( len_y, 2.0 );
    var f = k * ( a.level * b.level ) / r2;
    return f;
  }
  // クーロン力を元に1次方程式を求めるメソッド
  get_formula( a, b ) {
    var f = this.calc_coulomb( a, b );
    var slope, intercept;
    if( a.y == b.y ) {
      slope = 0;
      intercept = a.y;
    } else if( a.x == b.x ) {
      slope = 0;
      intercept = 0;
    } else {
      slope = ( a.y - b.y ) / ( a.x - b.x );
      intercept = b.y - ( slope * a.y );
    }
    return [ f, slope, intercept ];
  }
  // 相対的な終点の座標を求めるメソッド
  get_xy( a,b ) {
    var answer = this.get_formula( a, b );
    var f = answer[0];
    var slope = answer[1];
    var intercept = answer[2];

    var end_x, end_y;

    if( a.x == b.x ) {
      end_x = a.x;
      if( a.y >= b.y ) end_y = a.y + f/this.vv;
      else end_y = a.y - f/this.vv;
    } else if( a.x > b.x )  {
      end_x = a.x + f/this.vv;
      end_y = intercept + slope * end_x;
      console.log("a.x is larger");
    } else {
      end_x = a.x - f/this.vv;
      end_y = slope * end_x + intercept;
      console.log("b.x is larger");
    }

    if( a.y == b.y ) {
      end_y = a.y;
      console.log("a.y=b.y");
    }

    return [ end_x - a.x, end_y - a.y ];

  }
}

// 点電荷を取り扱うクラス
class charge {
  constructor( x, y, level ) {
    this.x = x;
    this.y = y;
    this.level = level;
  }
}

// お試し用のメソッド．
// JavaScriptコンソールから「test1()」と入力すると以下のプログラムで示された座標に点電荷を置き，クーロン力をコンソールに表示する
// ちなみにnew chargeの引数は，順番にX座標，Y座標，電荷を示す
function test1() {
  var x = new coulomb();
  x.add( new charge( 100, 50, 1 ) );
  x.add( new charge( 50, 100, 1 ) );
  x.add( new charge( 50, 50, 1 ) );
  console.log( x.calc() );
}
