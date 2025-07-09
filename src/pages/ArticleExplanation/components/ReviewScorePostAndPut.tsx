import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const ReviewScorePostAndPut = () => {
  const reviewScoreEntity = `@Entity
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
}`;

  const unique = `@Table(name = "review_scores",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","article_id"}))`;

  const controller = `@PostMapping
public ResponseEntity<?> postScore(@RequestHeader(value = "Authorization") String token,
                                   @RequestBody ReviewScoreRequest request) {
    String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
    reviewScoreService.postScore(request, userEmail);
    return ResponseEntity.ok("ポスト成功");
}`;

  const service = `public void postScore(ReviewScoreRequest request, String userEmail) {
    UserEntity userEntity = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

    ReviewScoreEntity entity = new ReviewScoreEntity();
    entity.setUserId(userEntity.getId());
    entity.setScore(request.getScore());
    entity.setArticleId(request.getArticleId());
    reviewScoreRepository.save(entity);
}`;

  const controller2 = `@PutMapping("/{id}")
public ResponseEntity<?> putScore(@RequestHeader(value = "Authorization") String token,
                                  @RequestBody ReviewScoreRequest request) {
    String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
    reviewScoreService.putScore(request, userEmail);
    return ResponseEntity.ok("変更成功");
}`;

  const service2 = `public void putScore(ReviewScoreRequest request, String userEmail) {
    UserEntity userEntity = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません。"));

    ReviewScoreEntity existing = reviewScoreRepository
            .findByUserIdAndArticleId(userEntity.getId(), request.getArticleId())
            .orElseThrow(() -> new RuntimeException("スコアが存在しません。"));

    existing.setScore(request.getScore());
    existing.setUpdatedAt(LocalDateTime.now());
    reviewScoreRepository.save(existing);
}`;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h1 className="text-3xl font-bold">
        投稿記事にレビュースコアを投稿・更新する機能・DB連携
      </h1>
      <p>
        ユーザーは各記事に対して0〜5のスコアを1回だけ投稿でき、再投稿時は自動で更新されます。
        初回はPOST、2回目以降はPUTで処理され、user_idとarticle_idにユニーク制約を設けることでDB上でも重複を防止します。
      </p>

      <h2 className="text-xl font-semibold mt-8">1. Entityの定義</h2>
      <SyntaxHighlighter language="java" style={oneDark}>
        {reviewScoreEntity}
      </SyntaxHighlighter>
      <p>
        レビュー評価は1記事あたり一人一回のみとするため、
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          uniqueConstraints
        </code>{" "}
        を使用して、user_idとarticle_idの組み合わせがユニークになるよう制約を加えています。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {unique}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">2. Controller層（POST）</h2>
      <p>
        JWTトークンからuserEmailを抽出し、Service層に委譲して保存処理を行います。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {controller}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">3. Service層（POST）</h2>
      <p>
        userEmailでユーザー情報を取得し、対応するuser_idをスコアと共に保存します。
        これはINSERT操作に該当します。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {service}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">4. Controller層（PUT）</h2>
      <p>投稿済みスコアを更新するためのエンドポイントです。</p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {controller2}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">5. Service層（PUT）</h2>
      <p>
        更新時にはまず、同じ
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          user_id × article_id
        </code>
        のレコードが存在するか確認する必要があります。これをせずに
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          save()
        </code>
        を呼び出すと、新規INSERTと解釈されてしまい、ユニーク制約違反によって500エラーになります。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {service2}
      </SyntaxHighlighter>
      <p>
        そのため、以下のように既存データを取得し、存在すれば値を更新して保存（UPDATE）するという流れになります。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {`ReviewScoreEntity existing = reviewScoreRepository
    .findByUserIdAndArticleId(userEntity.getId(), request.getArticleId())
    .orElseThrow(() -> new RuntimeException("スコアが存在しません。"));`}
      </SyntaxHighlighter>
      <p className="mt-8">
        今回はユーザーごとのスコア投稿・更新機能の実装を通して、Spring
        BootとDB（MySQL）とのやり取りの基本を解説しました。
        <br />
        <br />
        今後の理解を深めるために、以下のトピックも別記事で掘り下げる予定です：
      </p>
      <ul className="list-disc pl-6 mt-2">
        <li>
          <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
            save()
          </code>{" "}
          の内部動作とINSERT/UPDATEの判定ロジック
        </li>
        <li>ユニーク制約と違反時のエラー例（500エラーへの対処）</li>
        <li>DTOの役割と例外ハンドリングの設計ベストプラクティス</li>
      </ul>
      <p className="mt-4">
        これらを押さえることで、より堅牢で予測可能なバックエンド処理の構築が可能になります。
      </p>

      <Link to="/tech">
        <p className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
