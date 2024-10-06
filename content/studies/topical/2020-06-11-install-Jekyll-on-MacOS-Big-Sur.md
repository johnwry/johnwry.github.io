---
Title: install Jekyll on MacOS Big Sur
Template: outline
Author: "John Wry"
titleIcon: "far fa-file-alt"
---

## Don't use the THIS for ruby. Go to step 2 first!
The instructions provided at the jekyll site did not work for me  on MacOS (and many others do not recommend it). It is not the correct way. 
DO NOT USE THESE:
>https://jekyllrb.com/docs/installation/macos/

I can't even begin to say how hard it has been to correct the issues this caused on my machine. 

One has to be a Ruby scientist to know how to correct it. A bit frustrating and time consuming to say the least.

## USE THIS
### Install Ruby separately
MacOS comes with Ruby installed. Do not use that. 

#### Overview

```bash
brew install ruby
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

1. There are clear instructions to walk you through it. Shout out to Chris Tobolski for putting this together.  [Install Ruby](https://stackify.com/install-ruby-on-your-mac-everything-you-need-to-get-going/)

### PATH issues

1. You need to open ~/.bashrc and ~/.bash_profile and look for anything modifying your PATH. We don't have visibility into those files, but they are where most modifications will occur.



## Start Using

1. Themes + Layouts
   1. https://www.youtube.com/watch?v=UuHrgv6p2Mg&t=358s
   2. https://www.youtube.com/watch?v=EmSrQCDsMv4



