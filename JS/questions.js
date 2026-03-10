(function () {
  const titleQuestions = [...document.querySelectorAll(".questions_title")];

  titleQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      let addPadding = question.parentElement.parentElement;

      // Toggle CSS class to handle all visual changes
      addPadding.classList.toggle("questions_padding--add");
      question.children[0].classList.toggle("questions_arrow--rotate");
    });
  });
})();
