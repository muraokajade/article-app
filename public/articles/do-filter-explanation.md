# Spring Security：`filterChain.doFilter()` の意味と使い方

---

## 1. これは何のため？

`filterChain.doFilter(request, response)` は、  
「このリクエストは通して良いよ」と**次の処理へ渡す合図**です。  
これを呼ばなければコントローラーまで届かず、認証があってもページは返りません。

---

## 2. 実際のコード例（コメント付き）

```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {

    // 🔐 Firebaseトークン検証など、認証ロジックをここに実装
    // （例）SecurityContextに認証情報をセットする処理など

    System.out.println("🔥 カスタムフィルター処理が呼び出されました");

    // ✅ 認証が成功したら、次のフィルターやコントローラーに処理を進める
    filterChain.doFilter(request, response);

    // ⚠️ この行を呼ばなければ、リクエストは途中で止まります
}
```
3. どこに進むの？
UsernamePasswordAuthenticationFilter や他のセキュリティフィルター

ExceptionTranslationFilter などの例外制御

@RestController が処理を引き継ぐ

4. 呼ばなかったら？
doFilter() を呼ばなければ、レスポンスは返されず、
クライアントは「無反応」またはエラー画面（403など）を受け取ります。

