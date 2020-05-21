function Pagination(options) {
    let {
        el,
        total = 0,
        size = 10,
        currentPage = 1,
        pageChange = () => {}
    } = options;
    this.el = el;
    this.total = total;
    this.size = size;
    this.currentPage = currentPage;
    this.pageChange = pageChange;
    this.initPage(currentPage);
}

Pagination.prototype.initPage = function (currentPage=1) {
   
    /* 先算出一共多少页 */
    this.pages = Math.ceil(this.total / this.size);
    if (currentPage>this.pages) currentPage = this.pages
    /* 起始页： 判断当前页是否小与5，小与则从第一页开始，大于让当前页-5，也就是让保持当前页位于中间位置*/
    this.start = currentPage > 5 ? currentPage - 5 : 0
    /* 末尾页： 起始页加上10就是末尾页， 但是有可能超出总的页数，所以先去判断总页数 减去 起始页数是否大于10，
       如果大于10，然后可以安心用start加上10，如果不大于10，直接就用总页数充当末尾数  
    */
    this.end = this.pages - this.start > 10 ? this.start + 10 : this.pages

    /* 这个判断处理 有可能算出起始页到末尾页不够10页， 所以进行修正， 判断末尾页减去起始页是否不等于10，
        如果成立， 重置起始页， 末尾页减去10 就是起始页
    */
    if (this.end - this.start !== 10) { //页数不够10页 走以下逻辑
        // 直接用尾页-长度10 等于开始页， 但是有可能end页小与10，所以做个判断
        this.start = this.end - 10 > 0 ? this.end - 10 : this.start; 

    }

    let pageList = []; /* pageList 分好页的容器 */
    for (let i = this.start + 1; i <= this.end; i++) {
        pageList.push(i);
    }
    let str = ` <ul><button type="button" class="prev" ${currentPage === 1 ? 'disabled':''}> < </button> `;
    pageList.forEach(item => {
        str += `
            <li class="number ${(item===currentPage)?'active':''}">${item}</li>
        `
    });
    str += ` <button type="button" class="next" ${currentPage === this.end ? 'disabled' : ''}> > </button></ul>`
    let div = document.createElement('div');
    document.getElementById('f-pagebar') && document.getElementById('f-pagebar').remove();
    div.id = 'f-pagebar';
    div.innerHTML = str;

    this.el.appendChild(div);
    this.bindEvent();
}
Pagination.prototype.bindEvent = function () {
    let _this = this;
    let pageBar = document.getElementById('f-pagebar'),
        pageItems = Array.from(pageBar.getElementsByClassName('number'));
    /* 获取page页绑定click事件 */
    pageItems.forEach(item => {
        item.addEventListener('click', function () {
            let pgActive = pageBar.getElementsByClassName('active')[0];
            let v = Number(this.innerText);
            if (this.className.indexOf('active') !== -1) return;
            pgActive.classList.remove('active');
            this.classList.add('active');
            _this.pageChange(v); //执行回调；
            _this.initPage(v); // 重新render pageBar；
        })
    });
    let prev = pageBar.getElementsByClassName('prev')[0],
        next = pageBar.getElementsByClassName('next')[0];

    prev.onclick = function(){
        pageBar.getElementsByClassName('active')[0].previousElementSibling.click();
    }
    next.onclick = function(){
        pageBar.getElementsByClassName('active')[0].nextElementSibling.click();
    }

}