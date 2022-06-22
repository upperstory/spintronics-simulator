/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismIdHandle } from './id/cubismid';
import { csmMap } from './type/csmmap';
/**
 * モデル設定情報を取り扱う関数を宣言した純粋仮想クラス。
 *
 * このクラスを継承することで、モデル設定情報を取り扱うクラスになる。
 */
export declare abstract class ICubismModelSetting {
    /**
     * Mocファイルの名前を取得する
     * @return Mocファイルの名前
     */
    abstract getModelFileName(): string;
    /**
     * モデルが使用するテクスチャの数を取得する
     * テクスチャの数
     */
    abstract getTextureCount(): number;
    /**
     * テクスチャが配置されたディレクトリの名前を取得する
     * @return テクスチャが配置されたディレクトリの名前
     */
    abstract getTextureDirectory(): string;
    /**
     * モデルが使用するテクスチャの名前を取得する
     * @param index 配列のインデックス値
     * @return テクスチャの名前
     */
    abstract getTextureFileName(index: number): string;
    /**
     * モデルに設定された当たり判定の数を取得する
     * @return モデルに設定された当たり判定の数
     */
    abstract getHitAreasCount(): number;
    /**
     * 当たり判定に設定されたIDを取得する
     *
     * @param index 配列のindex
     * @return 当たり判定に設定されたID
     */
    abstract getHitAreaId(index: number): CubismIdHandle;
    /**
     * 当たり判定に設定された名前を取得する
     * @param index 配列のインデックス値
     * @return 当たり判定に設定された名前
     */
    abstract getHitAreaName(index: number): string;
    /**
     * 物理演算設定ファイルの名前を取得する
     * @return 物理演算設定ファイルの名前
     */
    abstract getPhysicsFileName(): string;
    /**
     * パーツ切り替え設定ファイルの名前を取得する
     * @return パーツ切り替え設定ファイルの名前
     */
    abstract getPoseFileName(): string;
    /**
     * 表情設定ファイルの数を取得する
     * @return 表情設定ファイルの数
     */
    abstract getExpressionCount(): number;
    /**
     * 表情設定ファイルを識別する名前（別名）を取得する
     * @param index 配列のインデックス値
     * @return 表情の名前
     */
    abstract getExpressionName(index: number): string;
    /**
     * 表情設定ファイルの名前を取得する
     * @param index 配列のインデックス値
     * @return 表情設定ファイルの名前
     */
    abstract getExpressionFileName(index: number): string;
    /**
     * モーショングループの数を取得する
     * @return モーショングループの数
     */
    abstract getMotionGroupCount(): number;
    /**
     * モーショングループの名前を取得する
     * @param index 配列のインデックス値
     * @return モーショングループの名前
     */
    abstract getMotionGroupName(index: number): string;
    /**
     * モーショングループに含まれるモーションの数を取得する
     * @param groupName モーショングループの名前
     * @return モーショングループの数
     */
    abstract getMotionCount(groupName: string): number;
    /**
     * グループ名とインデックス値からモーションファイル名を取得する
     * @param groupName モーショングループの名前
     * @param index     配列のインデックス値
     * @return モーションファイルの名前
     */
    abstract getMotionFileName(groupName: string, index: number): string;
    /**
     * モーションに対応するサウンドファイルの名前を取得する
     * @param groupName モーショングループの名前
     * @param index 配列のインデックス値
     * @return サウンドファイルの名前
     */
    abstract getMotionSoundFileName(groupName: string, index: number): string;
    /**
     * モーション開始時のフェードイン処理時間を取得する
     * @param groupName モーショングループの名前
     * @param index 配列のインデックス値
     * @return フェードイン処理時間[秒]
     */
    abstract getMotionFadeInTimeValue(groupName: string, index: number): number;
    /**
     * モーション終了時のフェードアウト処理時間を取得する
     * @param groupName モーショングループの名前
     * @param index 配列のインデックス値
     * @return フェードアウト処理時間[秒]
     */
    abstract getMotionFadeOutTimeValue(groupName: string, index: number): number;
    /**
     * ユーザーデータのファイル名を取得する
     * @return ユーザーデータのファイル名
     */
    abstract getUserDataFile(): string;
    /**
     * レイアウト情報を取得する
     * @param outLayoutMap csmMapクラスのインスタンス
     * @return true レイアウト情報が存在する
     * @return false レイアウト情報が存在しない
     */
    abstract getLayoutMap(outLayoutMap: csmMap<string, number>): boolean;
    /**
     * 目パチに関連付けられたパラメータの数を取得する
     * @return 目パチに関連付けられたパラメータの数
     */
    abstract getEyeBlinkParameterCount(): number;
    /**
     * 目パチに関連付けられたパラメータのIDを取得する
     * @param index 配列のインデックス値
     * @return パラメータID
     */
    abstract getEyeBlinkParameterId(index: number): CubismIdHandle;
    /**
     * リップシンクに関連付けられたパラメータの数を取得する
     * @return リップシンクに関連付けられたパラメータの数
     */
    abstract getLipSyncParameterCount(): number;
    /**
     * リップシンクに関連付けられたパラメータの数を取得する
     * @param index 配列のインデックス値
     * @return パラメータID
     */
    abstract getLipSyncParameterId(index: number): CubismIdHandle;
}
import * as $ from './icubismmodelsetting';
export declare namespace Live2DCubismFramework {
    const ICubismModelSetting: typeof $.ICubismModelSetting;
    type ICubismModelSetting = $.ICubismModelSetting;
}
//# sourceMappingURL=icubismmodelsetting.d.ts.map