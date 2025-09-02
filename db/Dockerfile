FROM mariadb:11.8

COPY ./conf.d/my.cnf /etc/mysql/conf.d/my.cnf

RUN chmod 644 /etc/mysql/conf.d/my.cnf \
    && chown mysql:mysql /etc/mysql/conf.d/my.cnf