import pandas as pd

input_file = 'songs.csv'
output_file = 'japan_songs_subset.csv'
chunk_size = 50000

## 中身を少しだけ見て確認するコード
#df_check = pd.read_csv('songs.csv', nrows=5)
#print(df_check.head())

print("抽出を開始します。")

first_chunk = True
found_any = False

try:
    # 巨大なファイルを分割して読み込む
    for chunk in pd.read_csv(input_file, chunksize=chunk_size):
        
        # 列名 'nichi_genre' が存在するか確認
        if 'niche_genres' in chunk.columns:
            target_col = 'niche_genres'
        else:
            # 万が一列名が違った場合、24番目の列（index 23）を使用
            target_col = chunk.columns[23]
        
        # 検索条件（大文字小文字を区別せず j-pop, anime, j-rock, japanese を探す）
        # astype(str) で数値化けを防ぎます
        mask = chunk[target_col].astype(str).str.contains('j-pop|anime|j-rock|japanese', case=False, na=False)
        
        filtered_chunk = chunk[mask]
        
        if not filtered_chunk.empty:
            found_any = True
            if first_chunk:
                # 初回のみヘッダーを作成
                filtered_chunk.to_csv(output_file, index=False, mode='w', encoding='utf-8-sig')
                first_chunk = False
            else:
                # 2回目以降は追記
                filtered_chunk.to_csv(output_file, index=False, mode='a', header=False, encoding='utf-8-sig')
    
    if not found_any:
        print("条件に一致する曲が見つかりませんでした。'genre' 列の内容を再確認してください。")
    else:
        print(f"成功しました！ '{output_file}' にデータが書き込まれました。")

except Exception as e:
    print(f"エラーが発生しました: {e}")