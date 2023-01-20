// methods
import Init from './Init.js'
import Reset from './Reset.js';
import CreateChess from './chess/CreateChess.js';
import Fill from './Fill.js';
import BreakMatch3 from './BreakMatch3.js';
import PreTest from './PreTest.js';
import GetAllMatch from './match/GetAllMatch.js';

const GetValue = Phaser.Utils.Objects.GetValue;
class Board {
    constructor(bejeweled, config) {
        var scene = bejeweled.scene;
        this.scene = scene;
        this.rexBoard = bejeweled.rexBoard;
        this.board = this.rexBoard.add.board(GetValue(config, 'board', undefined));
        this.match = this.rexBoard.add.match(GetValue(config, 'match', undefined));
        this.match.setBoard(this.board);

        this.initSymbolsMap = GetValue(config, 'initMap', undefined); // 2d array
        // configuration of chess
        this.chessTileZ = GetValue(config, 'chess.tileZ', 1);
        this.candidateSymbols = GetValue(config, 'chess.symbols', undefined);
        this.chessCallbackScope = GetValue(config, 'chess.scope', undefined);
        this.chessCreateCallback = GetValue(config, 'chess.create', undefined);
        this.chessMoveTo = GetValue(config, 'chess.moveTo', {});
        this.chessMoveTo.occupiedTest = true;
    }

    shutdown() {
        this.match.destroy();
        this.board.destroy();

        this.board = undefined;
        this.match = undefined;

        this.initSymbolsMap = undefined;
        this.candidateSymbols = undefined;
        this.chessCallbackScope = undefined;
        this.chessCreateCallback = undefined;
        this.chessMoveTo = undefined;

        return this;
    }

    destroy() {
        this.shutdown();
        return this;
    }

    setBoardWidth(width) {
        this.board.setBoardWidth(width);
        return this;
    }

    setBoardHeight(height) {
        this.board.setBoardHeight(height);
        return this;
    }

    setInitSymbolsMap(map) {
        this.initSymbolsMap = map; // 2d array
        return this;
    }

    worldXYToChess(worldX, worldY) {
        return this.board.worldXYToChess(worldX, worldY, this.chessTileZ);
    }

    tileXYToChess(tileX, tileY) {
        return this.board.tileXYZToChess(tileX, tileY, this.chessTileZ);
    }

    getNeighborChessAtAngle(chess, angle) {
        var direction = this.board.angleSnapToDirection(chess, angle);
        return this.getNeighborChessAtDirection(chess, direction);
    }

    getNeighborChessAtDirection(chess, direction) {
        var neighborTileXY = this.board.getNeighborTileXY(chess, direction);
        var neighborChess = (neighborTileXY) ?
            this.board.tileXYZToChess(neighborTileXY.x, neighborTileXY.y, this.chessTileZ) :
            null;
        return neighborChess;
    }
}

var methods = {
    init: Init,
    reset: Reset,
    createChess: CreateChess,
    fill: Fill,
    breakMatch3: BreakMatch3,
    preTest: PreTest,
    getAllMatch: GetAllMatch,
}
Object.assign(
    Board.prototype,
    methods
);
export default Board;