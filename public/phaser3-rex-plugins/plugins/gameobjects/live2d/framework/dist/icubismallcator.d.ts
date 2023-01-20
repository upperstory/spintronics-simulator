/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * メモリアロケーションを抽象化したクラス
 *
 * メモリ確保・解放処理をプラットフォーム側で実装して
 * フレームワークから呼び出すためのインターフェース
 */
export declare abstract class ICubismAllocator {
    /**
     * アラインメント制約なしのヒープ・メモリーを確保します
     *
     * @param size 確保するバイト数
     * @return 成功すると割り当てられたメモリのアドレス。そうでなければ'0'を返す
     */
    abstract allocate(size: number): any;
    /**
     * アラインメント制約なしのヒープ・メモリーを解放します。
     *
     * @param memory 解放するメモリのアドレス
     */
    abstract deallocate(memory: any): void;
    /**
     * アラインメント制約有のヒープ・メモリーを確保します。
     * @param size 確保するバイト数
     * @param alignment メモリーブロックのアラインメント幅
     * @return 成功すると割り当てられたメモリのアドレス。そうでなければ'0'を返す
     */
    abstract allocateAligned(size: number, alignment: number): any;
    /**
     * アラインメント制約ありのヒープ・メモリーを解放します。
     * @param alignedMemory 解放するメモリのアドレス
     */
    abstract deallocateAligned(alignedMemory: any): void;
}
import * as $ from './icubismallcator';
export declare namespace Live2DCubismFramework {
    const ICubismAllocator: typeof $.ICubismAllocator;
    type ICubismAllocator = $.ICubismAllocator;
}
//# sourceMappingURL=icubismallcator.d.ts.map