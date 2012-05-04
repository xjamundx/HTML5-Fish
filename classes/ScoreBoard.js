function ScoreBoard() {
  this.scores = ScoreBoard.getScores();
}

ScoreBoard.KEY = "scores";

ScoreBoard.store = window.localStorage || {};

ScoreBoard.getScores = function() {
  var scores = JSON.parse(ScoreBoard.store[ScoreBoard.key] || "[]");
  return scores;
};

ScoreBoard.putScores = function(scores) {
  scores = scores || [];
  ScoreBoard.store[ScoreBoard.key] = JSON.stringify(scores);
};

ScoreBoard.clearScores = function() {
  ScoreBoard.putScores([]);
};

ScoreBoard.prototype.top10 = function() {
  return this.scores.sort(function(a, b) {
    return a.score - b.score;
  }).slice(0, 10);
};

ScoreBoard.prototype.save = function(score, name) {
  this.scores.push(Score(score, name));
  ScoreBoard.putScores(this.scores);
};

ScoreBoard.tmpl = function(score) {
    var html = '';
    html += '<li>';
    html += '<span class="date">' + score.date + '</span> | ';
    html += '<span class="score">' + score.score + '</span> | ';
    html += '<span class="name">' + score.name + '</span>';
    html += '</li>';
    return html;
};

function Score(score) {
  return {
    date: new Date().toDateString().slice(4),
    score: score,
    name: ScoreBoard.store.name || "Anonymous"
  };
}

var $name = $("#name");
$name.text(ScoreBoard.store.name);
$("#name").keyup(function() {
  ScoreBoard.store.name = $name.text();
});