# Spring Bootで記事編集用データを取得する流れ

管理者が記事を編集する際には、対象の記事データを事前に取得してフォームに表示する必要があります。  
この機能は「IDで記事を検索し、DTOに変換して返す」という構成で実現できます。

---

## 1. Controller層：IDから該当記事を取得

`/article/{id}` というエンドポイントに対して `GET` リクエストを送ることで、  
該当IDの記事データを取得します。このとき、`@PreAuthorize` によって管理者のみアクセス可能に制限します。

```java
@GetMapping("/article/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ArticleDTO> getArticle(@RequestHeader(name = "Authorization") String token,
                                             @PathVariable Long id) {
    firebaseAuthService.verifyAdminAndGetEmail(token);
    ArticleDTO articleDTO = articleService.findById(id);
    return ResponseEntity.ok(articleDTO);
}
```
2. Service層：Repositoryで検索してDTOに変換
Controllerから呼び出されたService層では、findById によってリポジトリから記事Entityを検索し、
見つかった場合はDTOに変換して返します。見つからない場合は例外を投げます。

```java
public ArticleDTO findById(Long id) {
    ArticleEntity entity =  articleRepository.findById(id)
            .orElseThrow(() ->new RuntimeException("記事が見つかりません。"));
    return convertToDTO(entity);
}
```
3. Controller層：更新リクエストを受け取る
管理者が編集フォームから送信した内容を元に、
PUT /article/{id} のエンドポイントに対して更新処理を行います。
リクエストには画像を含めるため、@ModelAttribute を使用して受け取ります。

```java
@PutMapping("/article/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ArticleDTO> updateArticle(@RequestHeader(name = "Authorization") String token,
                                                @PathVariable Long id,
                                                @ModelAttribute ArticleRequest request)
{
    firebaseAuthService.verifyAdminAndGetEmail(token);
    ArticleDTO articleDTO = articleService.updateArticle(id,request);
    return ResponseEntity.ok(articleDTO);
}
```
4. Service層：既存のエンティティを更新し保存
指定されたIDから既存のEntityを取得し、リクエストで送られた内容で更新を行います。
画像ファイルがある場合は保存し、URLを再設定します。
最終的に保存されたEntityをDTOに変換して返します。

```java
public ArticleDTO updateArticle(Long id, ArticleRequest request) {
    //該当記事があるか判定
    ArticleEntity existing = articleRepository.findById(id)
            .orElseThrow(() ->new RuntimeException("記事が存在しません。"));

    //記事が存在していたらEntityに詰める
    existing.setSlug(request.getSlug());
    existing.setSectionTitle(request.getSectionTitle());
    existing.setTitle(request.getTitle());
    existing.setContent(request.getContent());

    String imageUrl = saveImageAndGetUrl(request.getImage());
    existing.setImageUrl(imageUrl);

    ArticleEntity saved = articleRepository.save(existing);
    //DTOにして返却
    return convertToDTO(saved);
}
```
5. DTO変換処理：Entityをクライアント返却用に整形
Service層では更新後のEntityをフロントエンドに返すため、
専用のDTO変換メソッドを通じて整形します。

```java
//EntityをDTOにする共通処理
private ArticleDTO convertToDTO(ArticleEntity entity) {
    return new ArticleDTO(
            entity.getId(),
            entity.getSlug(),
            entity.getTitle(),
            entity.getSectionTitle(),
            entity.getContent(),
            entity.getImageUrl(),
            entity.getCreatedAt(),
            entity.getUpdatedAt(),
            entity.isPublished()
    );
}
```
