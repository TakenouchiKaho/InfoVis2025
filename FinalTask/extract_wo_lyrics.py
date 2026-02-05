import pandas as pd

input_file = 'songs.csv'
output_file = 'japanese_songs_no_lyrics.csv'
# 検索キーワード
keywords = ['j-pop', 'anime', 'j-rock', 'japanese', 'vocaloid', 'shibuya-kei']

print("抽出を開始します。インデックス23の列のみをスキャンし、lyricsを除外します...")

first_chunk = True
found_count = 0

try:
    # 1. 最初に列名のリストを取得
    full_header = pd.read_csv(input_file, nrows=0)
    all_columns = full_header.columns.tolist()
    
    # インデックス23（24番目の列）の名前を特定
    # ※ExcelのW列がインデックス22、X列が23に相当します
    target_col_name = all_columns[23]
    print(f"検索対象の列名: {target_col_name} (Index: 23)")
    
    # 2. lyricsを除外した「使用する列」のリストを作成
    cols_to_use = [col for col in all_columns if col.lower() != 'lyrics']
    
    # 3. 指定した列だけをチャンクごとに読み込む
    for chunk in pd.read_csv(input_file, usecols=cols_to_use, chunksize=50000, low_memory=False):
        
        # 指定した「インデックス23の列」だけを対象にキーワード検索
        # astype(str) で確実に文字列として処理します
        mask = chunk[target_col_name].astype(str).str.contains('|'.join(keywords), case=False, na=False)
        
        filtered_chunk = chunk[mask]
        
        if not filtered_chunk.empty:
            found_count += len(filtered_chunk)
            if first_chunk:
                # 初回のみヘッダーを作成（BOM付きUTF-8でExcel文字化け防止）
                filtered_chunk.to_csv(output_file, index=False, mode='w', encoding='utf-8-sig')
                first_chunk = False
            else:
                # 2回目以降は追記
                filtered_chunk.to_csv(output_file, index=False, mode='a', header=False, encoding='utf-8-sig')
            
            print(f"現在までに {found_count} 曲見つかりました...")

    if found_count == 0:
        print("指定された列にキーワードが見つかりませんでした。インデックス番号が正しいか確認してください。")
    else:
        print(f"成功！ 合計 {found_count} 曲を '{output_file}' に保存しました。")

except Exception as e:
    print(f"エラーが発生しました: {e}")