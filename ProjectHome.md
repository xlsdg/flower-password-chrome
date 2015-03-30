# 花密 Flower Password --- 可记忆的密码管理方案 #

有别于一般密码管理方式，“花密”是一种可记忆、非储存的密码管理方案，你只需记住一个“记忆密码”加上“区分代号”就可以使用“花密”为不同的账号生成难以破解的强壮密码。[>>介绍说明](http://flowerpassword.com/guide)

本Chrome插件用于简化花密的操作。

**Web Store安装地址：https://chrome.google.com/webstore/detail/ggfnopabjhlbcmchfajkadagogmohglj**

### 更新 ###

v2.0.2:
  * 使用最新版的Chrome API

v2.0.1：
  * 检查本地数据被禁用导致无法保存设置的情况，并给出提示

v2.0：
  * 在网页内部iframe外显示花密窗口，从而使花密窗口不被遮盖
  * 隔离网页与花密窗口，使花密窗口不受网页样式影响而走样
  * 检查并提示记忆密码强度
  * 改为鼠标悬停提示的形式
  * 自动将生成的密码复制到剪贴板（默认关闭）

[以往版本的更新日志](Changelog.md)

### 截图 ###

![http://flower-password-chrome.googlecode.com/svn/trunk/screenshot.png](http://flower-password-chrome.googlecode.com/svn/trunk/screenshot.png)

### 使用 ###

当用户在任意页面聚焦到任意密码输入框时，下面会弹出花密的输入窗口（如右图所示），输入记忆密码和区分代号之后，生成的密码会自动填充到该密码输入框中。

在页面的任意位置按Alt+S可聚焦到记忆密码输入框；在页面任意地方按Alt+W，或者在花密的输入框中按Enter键或Esc键将关闭花密的窗口。

单击地址栏右边的花密图标，可针对该网站选择启用或停用花密插件，如下图所示。

![http://flower-password-chrome.googlecode.com/svn/trunk/src/img/switch-screenshot.png](http://flower-password-chrome.googlecode.com/svn/trunk/src/img/switch-screenshot.png)

可以在全局设置中设置是否默认在所有网站启用花密。