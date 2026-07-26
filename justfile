image := "localhost/risun-blog:latest"
quadlet_dir := env("XDG_CONFIG_HOME", env("HOME") + "/.config") + "/containers/systemd"

default: deploy

build:
    docker build --pull --tag {{image}} .

install:
    install -D -m 0644 deploy/quadlet/risun-blog.container {{quadlet_dir}}/risun-blog.container
    systemctl --user daemon-reload

start:
    systemctl --user restart risun-blog.service

deploy: build install start

stop:
    systemctl --user stop risun-blog.service

status:
    systemctl --user --no-pager --full status risun-blog.service

logs:
    journalctl --user --unit risun-blog.service --follow
