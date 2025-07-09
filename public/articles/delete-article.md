# 管理者による記事削除機能を実装する（安全かつ即時反映）

管理者は記事を一覧画面から削除できます。認証付きで  
`DELETE` リクエストを送信し、削除後に画面を更新します。

---

## 1. Controller：削除リクエストの受け取り

Firebaseトークンを検証し、管理者のみが削除可能とします。  
対象IDで記事を探し、存在すれば削除を実行します。

```java
@DeleteMapping("/article/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteArticle(@RequestHeader(name = "Authorization") String token,
                                          @PathVariable Long id) {
    firebaseAuthService.verifyAdminAndGetEmail(token);
    articleService.deleteArticle(id);
    return ResponseEntity.noContent().build();
}
```
2. Service：記事の削除処理
Repositoryから対象のEntityを検索し、存在する場合のみ削除します。

```java
public void deleteArticle(Long id) {
    ArticleEntity entity = articleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("記事が存在しません。"));
    articleRepository.delete(entity);
}
```
3. React：削除処理の送信
確認ダイアログのあと、axiosで削除リクエストを送信し、
成功時には画面を再描画するために setRefresh(!refresh) を実行します。

```tsx
const handleDelete = async (id: number) => {
  if (!window.confirm("本当に削除しますか？")) return;

  try {
    await axios.delete(`/api/admin/article/${id}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log("削除成功");
    setRefresh(!refresh);
  } catch (e) {
    console.error("削除失敗", e);
  }
};
```
4. 削除ボタンのUI例
ボタンを押すことで削除がトリガーされます。

```tsx
<button
  onClick={() => handleDelete(article.id)}
  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
>
  削除
</button>
```
この構成により、認証とUXを両立した安全な削除機能が実現できます。