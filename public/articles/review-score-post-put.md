# 投稿記事にレビュースコアを投稿・更新する機能・DB連携

ユーザーは各記事に対して0〜5のスコアを1回だけ投稿でき、再投稿時は自動で更新されます。  
初回はPOST、2回目以降はPUTで処理され、user_idとarticle_idにユニーク制約を設けることでDB上でも重複を防止します。

---

## 1. Entityの定義

```java
@Entity
@Table(name = "review_scores",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","article_id"}))
@Data
public class ReviewScoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String userEmail;
    private Long articleId;
    private double score;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```
レビュー評価は1記事あたり一人一回のみとするため、
uniqueConstraints を使用して、user_idとarticle_idの組み合わせがユニークになるよう制約を加えています。

```java
@Table(name = "review_scores",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","article_id"}))
```
2. Controller層（POST）
JWTトークンからuserEmailを抽出し、Service層に委譲して保存処理を行います。

```java
@PostMapping
public ResponseEntity<?> postScore(@RequestHeader(value = "Authorization") String token,
                                   @RequestBody ReviewScoreRequest request) {
    String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
    reviewScoreService.postScore(request, userEmail);
    return ResponseEntity.ok("ポスト成功");
}
```
3. Service層（POST）
userEmailでユーザー情報を取得し、対応するuser_idをスコアと共に保存します。
これはINSERT操作に該当します。

```java
public void postScore(ReviewScoreRequest request, String userEmail) {
    UserEntity userEntity = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

    ReviewScoreEntity entity = new ReviewScoreEntity();
    entity.setUserId(userEntity.getId());
    entity.setScore(request.getScore());
    entity.setArticleId(request.getArticleId());
    reviewScoreRepository.save(entity);
}
```
4. Controller層（PUT）
投稿済みスコアを更新するためのエンドポイントです。

```java
@PutMapping("/{id}")
public ResponseEntity<?> putScore(@RequestHeader(value = "Authorization") String token,
                                  @RequestBody ReviewScoreRequest request) {
    String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
    reviewScoreService.putScore(request, userEmail);
    return ResponseEntity.ok("変更成功");
}
```
5. Service層（PUT）
更新時にはまず、同じ
user_id × article_id のレコードが存在するか確認する必要があります。
これをせずに save() を呼び出すと、新規INSERTと解釈されてしまい、
ユニーク制約違反によって500エラーになります。

```java
public void putScore(ReviewScoreRequest request, String userEmail) {
    UserEntity userEntity = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません。"));

    ReviewScoreEntity existing = reviewScoreRepository
            .findByUserIdAndArticleId(userEntity.getId(), request.getArticleId())
            .orElseThrow(() -> new RuntimeException("スコアが存在しません。"));

    existing.setScore(request.getScore());
    existing.setUpdatedAt(LocalDateTime.now());
    reviewScoreRepository.save(existing);
}
```

そのため、以下のように既存データを取得し、存在すれば値を更新して保存（UPDATE）するという流れになります。

```java
ReviewScoreEntity existing = reviewScoreRepository
    .findByUserIdAndArticleId(userEntity.getId(), request.getArticleId())
    .orElseThrow(() -> new RuntimeException("スコアが存在しません。"));
```
今回はユーザーごとのスコア投稿・更新機能の実装を通して、Spring BootとDB（MySQL）とのやり取りの基本を解説しました。

今後の理解を深めるために、以下のトピックも別記事で掘り下げる予定です：

save() の内部動作とINSERT/UPDATEの判定ロジック

ユニーク制約と違反時のエラー例（500エラーへの対処）

DTOの役割と例外ハンドリングの設計ベストプラクティス

これらを押さえることで、より堅牢で予測可能なバックエンド処理の構築が可能になります。


